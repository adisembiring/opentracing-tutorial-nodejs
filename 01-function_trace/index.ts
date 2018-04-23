import * as Bluebird from 'bluebird';
import * as faker from 'faker';

import { Span } from 'opentracing';
import { initTracer } from '../lib/tracing-initializer';

const tracer = initTracer('function-trace-service');

function randomDelay(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function sayHello(helloTo: string) {
  const span = tracer.startSpan('say-hello');
  span.setTag('hello-to', helloTo);

  const helloStr = await formatString(helloTo, span);
  await printString(helloStr, span);
  span.finish();
}

async function formatString(helloTo: string, rootSpan: Span) {
  const span = tracer.startSpan('format_string', { childOf: rootSpan.context() });
  await Bluebird.delay(randomDelay(1000));
  const formattedStr = `Hello, ${helloTo}!`;
  span.log({
    event: 'format-string',
    value: helloTo,
  });
  span.finish();
  return formattedStr;
}

async function printString(helloStr: string, rootSpan: Span) {
  const span = tracer.startSpan('print_string', { childOf: rootSpan.context() });
  await Bluebird.delay(randomDelay(1000));
  console.log(helloStr);
  span.log({
    event: 'print-string',
    value: helloStr,
  });
  span.finish();
}

sayHello(faker.name.findName()).catch(err => console.error('main function err', err));
