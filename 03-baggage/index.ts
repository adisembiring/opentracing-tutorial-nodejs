import * as clsBluebird from 'cls-bluebird';
import * as cls from 'continuation-local-storage';
import * as faker from 'faker';
import * as rp from 'request-promise';

import { FORMAT_HTTP_HEADERS, Span, Tags } from 'opentracing';
import { initTracer } from '../lib/tracing-initializer';

const ns = cls.createNamespace('myNameSpace');
clsBluebird(ns);
const tracer = initTracer('hello-baggage-app');

async function httpGet(action: string, url: string, span: Span) {
  const method = 'GET';
  const headers = {};
  span.setTag(Tags.HTTP_URL, url);
  span.setTag(Tags.HTTP_METHOD, method);
  span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
  tracer.inject(span, FORMAT_HTTP_HEADERS, headers);

  try {
    const data = await rp({ url, headers });
    return data;
  } finally {
    span.finish();
  }
}

function formatString(input: string) {
  const rootSpan: Span = ns.get('current_span');
  const url = `http://localhost:8081/format?helloTo=${input}`;
  const action = 'format';
  const span = tracer.startSpan(action, { childOf: rootSpan.context() });
  span.log({
    event: 'format_string',
    value: input,
  });
  return httpGet(action, url, span);
}

function printString(input: string) {
  const rootSpan: Span = ns.get('current_span');
  const url = `http://localhost:8082/print?helloStr=${input}`;
  const action = 'print';
  const span = tracer.startSpan(action, { childOf: rootSpan.context() });
  span.log({
    event: 'print-string',
    value: input,
  });
  return httpGet(action, url, span);
}

async function sayHello(helloTo: string, greeting: string) {
  const span = tracer.startSpan('say-hello');
  span.setTag('helloTo', helloTo);
  span.setBaggageItem('greeting', greeting);
  ns.run(async () => {
    ns.set('current_span', span);
    try {
      const helloStr = await formatString(helloTo);
      await printString(helloStr);
      span.setTag(Tags.HTTP_STATUS_CODE, 200);
    } catch (err) {
      span.setTag(Tags.ERROR, true);
      span.setTag(Tags.HTTP_STATUS_CODE, err.statusCode || 500);
    } finally {
      span.finish();
    }
  });
}

const name = faker.name.findName();
sayHello(name, "G'day")
  .then(() => console.log('say hello done'))
  .catch(err => console.error('main function err', err));
