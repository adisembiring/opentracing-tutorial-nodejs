import * as jaegerClient from 'jaeger-client';
import { Tracer } from 'opentracing';

export function initTracer(serviceName: string): Tracer {
  const config = {
    serviceName,
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      logSpans: true,
    },
  };

  const options = {
    logger: {
      info: function logInfo(msg: any) {
        console.log('INFO', msg);
      },
      error: function logError(msg: any) {
        console.log('ERROR', msg);
      },
    },
  };
  const tracer = jaegerClient.initTracer(config, options);
  return tracer;
}
