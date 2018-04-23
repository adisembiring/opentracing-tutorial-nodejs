import * as express from 'express';
import { FORMAT_HTTP_HEADERS, Span, SpanContext, SpanOptions, Tags } from 'opentracing';
import { initTracer } from '../lib/tracing-initializer';

const PORT = 8081;

const app = express();
const tracer = initTracer('formatter-service');

app.listen(PORT, () => {
  console.log('Formatter app listening on port', PORT);
});

function createSpan(req: express.Request) {
  const spanOptions: SpanOptions = {
    tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER },
  };
  const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);
  if (parentSpanContext) {
    spanOptions.childOf = parentSpanContext;
  }
  return tracer.startSpan('http_server', spanOptions);
}

app.get('/format', function(req: express.Request, res: express.Response) {
  const span = createSpan(req);
  const helloTo = req.query.helloTo;
  span.log({
    event: 'format',
    value: helloTo,
  });
  span.finish();
  res.send(`Hello, ${helloTo}!`);
});
