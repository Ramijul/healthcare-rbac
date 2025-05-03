import { getOrg } from 'src/organizations/organizations.utils';
import { User } from './users.entity';
import { Organization } from 'src/organizations/organizations.constants';

export interface OrganizationResponseDto {
  id: string;
  name: string;
}

export class UserResponseDto {
  id: number;
  username: string;
  role: string;
  org: OrganizationResponseDto;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.role = user.role;
    this.org = {
      id: user.organizationId,
      name: (getOrg(user.organizationId) as Organization).name,
    };
  }
}
