# Error Handling Review Checklist

Use this checklist during PR reviews or development to ensure robust error handling.

## Fundamentals
- [ ] Are all external service calls (API, DB) wrapped in try/except or Result checks?
- [ ] Are input parameters validated before use?
- [ ] Is cleanup (closing files/connections) handled in `finally` or `with` blocks?
- [ ] Are empty catch/except blocks avoided?

## Reporting & Logging
- [ ] Do error messages explain what happened and how to fix it?
- [ ] Are unexpected errors logged with full stack traces?
- [ ] Do custom errors include relevant metadata (timestamps, IDs, codes)?
- [ ] Is sensitive information (passwords, tokens) filtered out of error logs?

## Resiliency
- [ ] Is there a retry strategy for transient network errors?
- [ ] Is a circuit breaker implemented for failing external dependencies?
- [ ] Are there fallbacks (graceful degradation) for non-critical failures?

## Code Quality
- [ ] Is the naming of custom exceptions descriptive?
- [ ] Are errors caught at the level where they can be meaningfully handled?
- [ ] Are internal implementation details kept out of error messages for users?
