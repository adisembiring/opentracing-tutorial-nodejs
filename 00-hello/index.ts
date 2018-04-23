import * as faker from 'faker';
import { Tracer } from 'opentracing';
import { initTracer } from '../lib/tracing-initializer';

const tracer: Tracer = initTracer('hello-world-service');

function sayHello(helloTo: string) {
  const span = tracer.startSpan('say-hello');
  span.setTag('hello-to', helloTo);
  const helloStr = `Hello, ${helloTo}!`;
  span.log({
    event: 'string-format',
    value: helloStr,
  });

  console.log(helloStr);
  span.log({ event: 'print-string' });
  span.finish();
  console.log('say hello finished!!!');
}

sayHello(faker.name.findName());
