# Setup

### Run project with docker-compose

_This will initiate a Postgres service with `turbovets` database initialized with 9 users and 30 patient records, and run the restful service._

1. Ensure Docker Daemon is running
2. Build and run project

   ```bash
   $ docker compose up --build
   ```

3. Remove all containers and associated volumes and images
   ```bash
   $ docker compose down -v --rmi all
   ```

### Run project without docker-compose

1. Create a postgres database named `turbovets`
2. Run the sql found in `/migrations/init-db.sql`
3. Add `.env` file at the project root with the following, with your values:
   ```
   DB_HOST=
   DB_PORT=5432
   DB_USERNAME=
   DB_PASSWORD=
   DB_NAME=turbovets
   JWT_SECRET=
   ```
4. Run
   ```bash
   $ yarn
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

# RBAC Implementation

List of Organizations and Roles have been kept static to focus on the RBAC logic. All routes are protected by `AuthGuard` unless decorated by `@Public` custom decorator that skips Auth. The `@RequireRole` custom decorator is used to set the minimum required Role needed to access a resource. If a Controller method is not decorated by neither of the decorators, only JWT token will be validated. Furthermore, the requester's `user identity` is injected into the in-flight request object for ease of access to requester's identity. Further database calls are made when needed to obtain additional user profile data.

```ts
interface UserIdentity {
  userId: number;
  role: string;
  orgs: string[];
}
```

Based on the user's identity, resources (namely patient-records) are filtered by the orgs the requester has access to, when performing any request.

# Data model

### Organizations: self referencing model that enables a tree structure.

The model has been kept static to keep focus on patient-records and RBAC implementation

```ts
interface organization {
      id: string;
      name: string;
      parentId: string | null; // references organizations.id
}

Static data available in `/src/organizations/organizations.constants.ts`
[
      { id: 'parentorg1', name: 'Org1', parent: null },
      { id: 'suborg1', name: 'Sub-Org1', parent: 'parentorg1' },
      { id: 'suborg2', name: 'Sub-Org2', parent: 'parentorg1' },
      { id: 'parentorg2', name: 'Org2', parent: null },
      { id: 'suborg3', name: 'Sub-Org3', parent: 'parentorg2' },
      { id: 'suborg4', name: 'Sub-Org4', parent: 'parentorg2' },
]
```

### Roles:

Roles are kept static for the scope of the problem. A very basic role inheritance has been implemented, such that a if a resource requires "Viwer" role an "Admin" can access as it since Admin inherits Viewer role/permissions.

The implementation can be further extended to achieve resource-level granularity and even field-level granularity.

Roles are determined in the following structure

```ts
Record<UserRole, { inherits: UserRole | null }>;
```

It can be extended for resource-level granularity as such

```ts
Record<UserRole, { inherits: UserRole | null; resource: string }>;
```

### Users

Users belong a organization. It is assumed that a user cannot be part of multiple orgs. However, being
part of a parent org permeates the role/permissions onto sub-orgs. It is also assumed that a user can have
only one role.

```ts
interface User {
  id: number;
  username: string;
  name: string;
  password: string;
  role: UserRole;
  organizationId: string;
}
```

### Patient Records

Patient Records are assumed to be part of a specific org. To access the record users will have to have the
appropriate permissions in the associated org (or it's parent org).

```ts
interface PatientRecord {
  id: number;
  medicalData: Record<string, any>;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  updatedBy: User;
}
```

# Audit Logging

Most basic implementation includes create and update timestamps along with the actors' information saved per record.
A better implementation would be to use WAL to save the actions to an `audit_log` table.

# Future Considerations

- The static implementation of roles need to be made dynamic. More roles will be added over time, and permissions will evolve. Current structure for permissions object allows for extending to implement
  resource-level, and even, field-level permissions
- "Organizations" too must be implemented as a module that uses Postgres to persist data
- **Security concerns:** - Containerize the app with approariate user permissions in Dockerfile - Switch to Auth0 and other IAM services. There will possibly be a need for implementing SSO. - consider smaller token expiration (currently hardcoded to 15 minutes). - Must remove hardcoded secrets and make use of `.env` file in `docker-compose.yml`. However, for the POC, given that the implementation is meant of local environment only, current implementation will suffice. - Integrate CASL to allow granular permissions - Other basic security implementation is necessary like CORS and Helmet which were intentionally left out for the purpose of the POC.
- **Performance Optimization:** Most database checks can be cached using Redis - such as fetching Org data, user profile, etc. It may also be beneficial to move the `auth service` out of the core application. This can aid in improving overall performance leveraging caching.
- **Additional features:**
  - Add HMR to improve DX
  - Use NX
  - Add super-user
  - Implement Org structure that go beyond 2 Levels.
  - Allow temporary access
  - Transfer of patient-records
  - Increase test coverage
  - Extend Role-Permissions to enable atleast resource-level granularity
