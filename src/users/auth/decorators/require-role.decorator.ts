import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/roles/roles.types';

// decorate with RequireRole to require a role for a resource
export const REQUIRE_ROLE_KEY = 'require-role';
export const RequireRole = (role: UserRole) =>
  SetMetadata(REQUIRE_ROLE_KEY, role);
