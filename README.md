# Meddihub HW

## Requirements

(:

### Features

- simple validated config with env overrides via CLI

### To add

- pagination
- swagger docs
- e2e tests
- docker
- output serialization
 
### Omitted

- plenty of nice to have eslints (e.g. organized imports)
- errors are default exception classes, they could be extended to have for example error codes
- code coverage
- state transitions between statuses in the Task entity
  - e.g. a transition from "done" to "new" should be probably forbidden
- delete endpoints
- logging
- tests are not robust enough for production code
  - for example, input validation for create/update tasks endpoint
  - 

### Arch. decisions

- Task.status enum exists on application level only, we do not enforce DB enums, as those can be difficult to maintain via migrations
