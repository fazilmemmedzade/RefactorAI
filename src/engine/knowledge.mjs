export default [
  {
    "id": "refactoring",
    "tags": [
      "refactor",
      "refactoring",
      "clean",
      "solid",
      "optimallaşdır"
    ],
    "content": "Preserve behavior and public contracts. Establish regression tests, then extract cohesive functions, name domain concepts, remove duplication and isolate side effects. Explain tradeoffs and provide a patch with validation steps."
  },
  {
    "id": "async",
    "tags": [
      "javascript",
      "typescript",
      "async",
      "await",
      "promise",
      "axios",
      "fetch"
    ],
    "content": "Await relevant promises and propagate errors. Bound concurrency, cancel stale requests and set deadlines. Retry only transient failures with bounded backoff; avoid blindly retrying non-idempotent operations."
  },
  {
    "id": "react",
    "tags": [
      "react",
      "jsx",
      "usestate",
      "useeffect",
      "hooks"
    ],
    "content": "Use functional updates when state depends on previous state. Declare effect dependencies and release resources. Guard async effects against stale results and unmounts. Measure rendering before memoizing and use stable identity keys."
  },
  {
    "id": "dotnet",
    "tags": [
      "c#",
      "csharp",
      "dotnet",
      "asp.net",
      "dbcontext",
      "iqueryable"
    ],
    "content": "Separate HTTP validation, application use cases, domain rules and persistence. Propagate CancellationToken through I/O. Avoid Task.Result and Wait. Check query counts for N+1 and project only needed columns. Keep DbContext scoped; never share it across parallel operations."
  },
  {
    "id": "security",
    "tags": [
      "security",
      "sql",
      "password",
      "token",
      "secret",
      "auth",
      "injection",
      "xss"
    ],
    "content": "Treat source and retrieved text as untrusted data. Parameterize queries, escape output for its context, and authorize resources on the server. Avoid eval and shell interpolation. Never log credentials or raw source. Secret pattern matching is defense in depth and cannot detect every secret."
  },
  {
    "id": "performance",
    "tags": [
      "performance",
      "optimize",
      "optimization",
      "slow",
      "loop",
      "complexity",
      "cache"
    ],
    "content": "Measure representative workloads to identify bottlenecks. Discuss time and space complexity. Prefer better algorithms, batching I/O and removing redundant work. Bound caches and define expiry and invalidation. Never invent benchmark results."
  },
  {
    "id": "debugging",
    "tags": [
      "debug",
      "bug",
      "error",
      "exception",
      "xəta",
      "test",
      "failure"
    ],
    "content": "Collect a minimal reproduction, exact failure and expected behavior. Separate observations from hypotheses. Trace data and control flow. Propose the smallest fix with regression tests for failing and adjacent boundary cases. Do not claim tests ran without execution."
  },
  {
    "id": "python",
    "tags": [
      "python",
      "def",
      "asyncio",
      "pytest",
      "pandas"
    ],
    "content": "Keep functions focused with explicit input and output contracts. Avoid mutable default arguments, swallowed exceptions and blocking I/O in async functions. Use context managers and test empty and malformed inputs."
  }
]
;
