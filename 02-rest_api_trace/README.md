# Lesson 02 - Tracing RPC Requests

## Objectives
Learn how to:
- Trace a transaction across more than one microservice
- Pass the context between processes using Inject and Extract
- Apply OpenTracing-recommended tags


## Run program from root directory
Formatter Service
```
$ npm install
$ node 02-rest_api_trace/formatter_service.js
```

Printer Service
```
$ npm install
$ node 02-rest_api_trace/formatter_service.js
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
INFO Reporting span 63d6f3c5978ede32:7978ab7c8587d0f9:63d6f3c5978ede32:1
INFO Reporting span 63d6f3c5978ede32:ffce3aeb7274bd46:63d6f3c5978ede32:1
INFO Reporting span 63d6f3c5978ede32:63d6f3c5978ede32:0:1
say hello done
```

formatter_service
```
INFO Initializing Jaeger Tracer with CompositeReporter and ConstSampler
Formatter app listening on port 8081
INFO Reporting span 63d6f3c5978ede32:ffea2232c6655ec2:7978ab7c8587d0f9:1
```

printer_service
```
INFO Initializing Jaeger Tracer with CompositeReporter and ConstSampler
Printer app listening on port 8082
Hello, Anderson Brekke!
INFO Reporting span 63d6f3c5978ede32:8aa2c67fb26f5583:ffce3aeb7274bd46:1
```