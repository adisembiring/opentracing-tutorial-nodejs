# Lesson 01 - Context and Tracing Functions

## Objectives
Learn how to:
- Trace individual function
- Combine multiple spans into a single trace
- Propagate the in-process context


## Run program from root directory
```
$ npm install
$ node 01-function_trace/index.js
```

expected result
```
INFO Initializing Jaeger Tracer with CompositeReporter and ConstSampler
INFO Reporting span 4b20a1775f33ad76:7d67ebb796004bd:4b20a1775f33ad76:1
Hello, Shana Sporer!
INFO Reporting span 4b20a1775f33ad76:80654ed19c3d5a56:4b20a1775f33ad76:1
INFO Reporting span 4b20a1775f33ad76:4b20a1775f33ad76:0:1
```