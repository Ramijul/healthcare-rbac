export class LoginDto {
  username: string;
  password: string;
}

export interface JwtPayload {
  sub: number;
  role: string;
  orgs: string[];
}

export interface UserIdentity {
  userId: number;
  role: string;
  orgs: string[];
}
