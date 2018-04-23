import * as Bluebird from 'bluebird';
import * as faker from 'faker';
import { FORMAT_HTTP_HEADERS, Span, Tags } from 'opentracing';
import * as rp from 'request-promise';
import { initTracer } from '../lib/tracing-initializer';

const tracer = initTracer('balon-app');

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

function formatString(input: string, rootSpan: Span) {
  const url = `http://localhost:8081/format?helloTo=${input}`;
  const action = 'format';
  const span = tracer.startSpan(action, { childOf: rootSpan.context() });
  span.log({
    event: 'format_string',
    value: input,
  });
  return httpGet(action, url, span);
}

function printString(input: string, rootSpan: Span) {
  const url = `http://localhost:8082/print?helloStr=${input}`;
  const action = 'print';
  const span = tracer.startSpan(action, { childOf: rootSpan.context() });
  span.log({
    event: 'print-string',
    value: input,
  });
  return httpGet(action, url, span);
}

async function sayHello(helloTo: string) {
  const span = tracer.startSpan('say-hello');
  span.setTag('helloTo', helloTo);
  try {
    const helloStr = await formatString(helloTo, span);
    const finalResult = await printString(helloStr, span);
    span.setTag(Tags.HTTP_STATUS_CODE, 200);
  } catch (err) {
    span.setTag(Tags.ERROR, true);
    span.setTag(Tags.HTTP_STATUS_CODE, err.statusCode || 500);
  } finally {
    span.finish();
  }
}

const name = faker.name.findName();
sayHello(name)
  .then(() => console.log('say hello done'))
  .catch(err => console.error('main function err', err));
