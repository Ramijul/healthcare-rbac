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

### Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# Data model

### Organizations: self referencing model that enables a tree structure.

      The model has been kept static to keep focus on patient-records and RBAC implementation

      ```
      Organizations
      - id
      - name
      - parentId (references Organizations.id; nullable)
      ```

### Roles and Permissions:

      Roles and permissions are kept static for the scope of the problem. It can certainly be made dynamic
      by using a database to persist the permission and roles.

      Permissions are resource specific, that are assigned to a role. Roles are extended to inherited permissions.
      This ensures future scalability.

### Users

      Users belong a organization. It is assumed that a user cannot be part of multiple orgs. However, being
      part of a parent org permeates the role/permissions onto sub-orgs. It is also assumed that a user can have
      only one role.

### Patient Records

      Patient Records are assumed to be part of a specific org. To access the record users will have to have the
      appropriate permissions in that associated org (or it's parent org).

# Audit Logging

Most basic implementation includes create and update timestamps along with the actors' information saved per record.
A better implementation would be to use WAL to save the actions to an `audit_log` table.

# Future Considerations

- The static implementation role and permissions need to be updated to make it dynamic. More roles will be added over time, and permissions will evolve. Currenl structure for permissions object allows for extending to implement
  record level, and event, field level permissions
- "Organizations" too must be implemented as a module that uses Postgres to persist data
- **Security concerns:** Containerize the app with approariate user permissions in Dockerfile; switch to Auth0
  and other IAM services; and, consider smaller token expiration (currently hardcoded to 15 minutes).
- **Performance Optimization:** Most database checks can be cached using Redis - such as fetching Org data, and permissions. It may also be beneficial
  to move the IAM service out of the core application. This can aid in improving overall performance leveraging caching.
- **Additional features:**
  - Add HMR to improve DX
  - Use NX
  - Add super-user
  - Implement Org structure that go beyond 2 Levels.
  - Allow temporary access
  - Transfer of patient-records
  - Increase test coverage
