# Setup

### Run project with docker-compose

_This will initiate a Postgres service with `turbovets` database, and run the restful service._

1. Ensure Docker Daemon is running
2. Build and run project

   ```bash
   $ docker compose up --build
   ```

3. Remove all containers and associated volumes and images
   ```bash
   $ docker compose down -v --rmi all
   ```

### Run project without docker

```bash
$ yarn install

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn build
$ yarn start:prod
```

### Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
