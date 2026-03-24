---
name: troubleshooting-errors
description: Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build resilient applications. Use when implementing error handling, designing APIs, or improving application reliability.
---

# Troubleshooting Errors

Build resilient applications with robust error handling strategies that gracefully handle failures and provide excellent debugging experiences.

## When to use this skill
- Implementing error handling in new features
- Designing error-resilient APIs
- Debugging production issues
- Improving application reliability
- Creating better error messages for users and developers
- Implementing retry and circuit breaker patterns
- Handling async/concurrent errors
- Building fault-tolerant distributed systems

## Workflow

1.  **Analyze Error Context**: Determine if the error is recoverable (e.g., network timeout) or unrecoverable (e.g., OOM).
2.  **Isolate & Reproduce**: Create a minimal reproduction case or use tests to confirm the bug.
3.  **Observability Audit**: Check logs, metrics (Prometheus/Grafana), and traces (Distributed Tracing) for the root cause.
4.  **Select Pattern**: Choose between Exceptions (unexpected) or Result Types (expected/functional).
5.  **Implement Guardrails**: Apply circuit breakers or retries for external service calls.
6.  **Preserve Context**: Ensure stack traces, metadata, and timestamps are captured.
7.  **Post-Mortem & Prevention**: Document the fix and add a regression test.

## Core Concepts

### 1. Error Handling Philosophies
- **Exceptions**: Traditional try-catch, disrupts control flow. Use for truly exceptional conditions.
- **Result Types**: Explicit success/failure, functional approach (e.g., Rust, TS/JS Result pattern). Use for expected failures like validation.
- **Error Codes**: C-style, requires discipline. Avoid in modern high-level languages unless necessary.

### 2. Implementation Patterns

#### Python: Custom Exceptions & Retries
```python
class ApplicationError(Exception):
    def __init__(self, message: str, code: str = None, details: dict = None):
        super().__init__(message)
        self.code = code
        self.details = details or {}
        self.timestamp = datetime.utcnow()

@retry(max_attempts=3, exceptions=(NetworkError,))
def fetch_data(url: str):
    # logic here
```

#### TS/JS: Result Pattern
```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function parseJSON<T>(json: string): Result<T, SyntaxError> {
  try {
    return { ok: true, value: JSON.parse(json) };
  } catch (error) {
    return { ok: false, error: error as SyntaxError };
  }
}
```

#### Rust/Go
- **Rust**: Use `Result` and `Option` types with the `?` operator for propagation.
- **Go**: Use explicit error returns and `errors.Is`/`errors.As` for checking.

## Universal Patterns

### Circuit Breaker
Prevent cascading failures by rejecting requests when an external service is failing.
- **CLOSED**: Normal operation.
- **OPEN**: Failing, reject immediately.
- **HALF_OPEN**: Testing recovery.

### Error Aggregation
Collect multiple errors (e.g., in a form validation) instead of failing on the first one.

### Graceful Degradation
Provide fallbacks (e.g., cache if DB is down) to maintain partial system functionality.

## Best Practices
- **Fail Fast**: Validate input early.
- **Meaningful Messages**: Explain *what* happened and *how* to fix it.
- **Clean Up**: Use `try-finally`, context managers (`with`), or `defer`.
- **Don't Swallow Errors**: Never use an empty catch/except block.

## Resources
- [Error Handling Checklist](resources/checklist.md)
- [Python Examples](examples/python_patterns.py)
- [TypeScript Patterns](examples/ts_patterns.ts)
