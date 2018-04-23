# Lesson 03 - Baggage and Async Hooks

## Objectives
Learn how to:
- Understand distributed context propagation
- Use baggage to pass data through the call graph


## Run program from root directory
Formatter Service
```
$ npm install
$ node 03-baggage/formatter_service.js
```

Printer Service
```
$ npm install
$ node node 03-baggage/printer_service.js
```

Hello Client
```
$ npm install
$ node 02-rest_api_trace/index.js
```

Expected result
index.js
```
INFO Initializing Jaeger Tracer with CompositeReporter and ConstSampler
say hello done
INFO Reporting span e5e0d421535c0e0:754e8a5f05df4d13:e5e0d421535c0e0:1
INFO Reporting span e5e0d421535c0e0:c5e989d555db61db:e5e0d421535c0e0:1
INFO Reporting span e5e0d421535c0e0:e5e0d421535c0e0:0:1
```

formatter_service
```
INFO Initializing Jaeger Tracer with CompositeReporter and ConstSampler
Formatter app listening on port 8081
INFO Reporting span e5e0d421535c0e0:2bacb45b87f6ecaa:754e8a5f05df4d13:1
```

printer_service
```
INFO Initializing Jaeger Tracer with CompositeReporter and ConstSampler
Printer app listening on port 8082
G'day, Derek Bahringer!
INFO Reporting span e5e0d421535c0e0:7eb6eac893749943:c5e989d555db61db:1
```