# Meddihub HW

## How to run

```bash
# set up local env
$ npm install
$ docker compose up -d
$ mv .env.example .env

# run the API locally 
$ npm run start

# run tests
$ npm run db:recreate:tests
$ npm run test
```

### Time estimate

- 26/2/2026 16:00 - about 12h
- 1/3/2026 - 18:00 - about 2hrs

### Features

- simple validated config with env overrides via CLI
- cursor-based pagination

### To add

- output serialization
  - clearer separation of output DTOs and database entities would be ideal
  - also, some internal columns do not need to be exposed (e.g. updatedAt)
 
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
  - another example, the completeness of output entities should be tested (e.g. references are loaded, but some sensitive properties are excluded)
  - e2e tests missing - not enough time
- docker image - ideally, when we discuss deployment, the first step is to prepare a docker image with the application 

### Arch. decisions

- overall nestjs framework + mikro-orm + postgres DB
  - set up for local development via docker-compose
  - set up local "dev" database for experimenting and another database for running integration tests
- I have skipped unit tests, I believe integration tests with DB access are the fastest way to ensure shipping a new small project 
- Task.status enum exists on application level only, we do not enforce DB enums, as those can be difficult to maintain via migrations
