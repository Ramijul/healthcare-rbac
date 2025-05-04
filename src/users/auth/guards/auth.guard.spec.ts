import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { REQUIRE_ROLE_KEY } from '../decorators/require-role.decorator';
import { AuthGuard } from './auth.guard';
import { UserRoles } from 'src/roles/roles.constants';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: mockConfigService.get('JWT_SECRET'),
            signOptions: { expiresIn: '60s' },
          }),
        }),
      ],
      providers: [
        AuthGuard,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
    configService = module.get<ConfigService>(ConfigService);
  });

  const createMockContext = (
    headers: Record<string, string>,
    handler?: Function,
  ) => ({
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
      getResponse: () => ({}),
    }),
    getHandler: () => handler || (() => {}),
    getClass: () => class MockController {},
  });

  describe('Public routes', () => {
    it('should allow access to public routes without token', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);
      const context = createMockContext({}) as ExecutionContext;

      expect(await guard.canActivate(context)).toBe(true);
    });
  });

  describe('Protected routes', () => {
    beforeEach(() => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    });

    describe('Role validation', () => {
      it('should validate required roles', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
          if (key === REQUIRE_ROLE_KEY) return UserRoles.ADMIN;
          return false;
        });

        const validToken = jwtService.sign({
          sub: '1',
          role: UserRoles.ADMIN,
          orgs: ['org1'],
        });
        const context = createMockContext({
          authorization: `Bearer ${validToken}`,
        }) as ExecutionContext;

        expect(await guard.canActivate(context)).toBe(true);
      });

      it('should reject insufficient roles', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
          if (key === REQUIRE_ROLE_KEY) return UserRoles.ADMIN;
          return undefined;
        });

        const token = jwtService.sign({
          sub: '1',
          role: UserRoles.VIEWER,
          orgs: ['org1'],
        });
        const context = createMockContext({
          authorization: `Bearer ${token}`,
        }) as ExecutionContext;

        await expect(guard.canActivate(context)).resolves.toBe(false);
      });

      it('should allow inheritted roles', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
          if (key === REQUIRE_ROLE_KEY) return UserRoles.VIEWER;
          return undefined;
        });

        const token = jwtService.sign({
          sub: '1',
          role: UserRoles.OWNER,
          orgs: ['org1'],
        });
        const context = createMockContext({
          authorization: `Bearer ${token}`,
        }) as ExecutionContext;

        await expect(guard.canActivate(context)).resolves.toBe(true);
      });
    });
  });
});
