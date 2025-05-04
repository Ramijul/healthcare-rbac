import { ForbiddenException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { PatientRecordsController } from './patient-records.controller';
import { PatientRecordsService } from './patient-records.service';
import { UserRoles } from '../roles/roles.constants';

const mockPatientRecordsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockUsersService = {
  findById: jest.fn().mockResolvedValue({
    id: 1,
    role: UserRoles.ADMIN,
    organizationId: 'org1',
  }),
};

describe('PatientRecordsController', () => {
  let controller: PatientRecordsController;
  let patientRecordsService: PatientRecordsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientRecordsController],
      providers: [
        {
          provide: PatientRecordsService,
          useValue: mockPatientRecordsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<PatientRecordsController>(PatientRecordsController);
    patientRecordsService = module.get<PatientRecordsService>(
      PatientRecordsService,
    );
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /patient-records', () => {
    it("should return records from users' organizations", async () => {
      const mockUser = { userId: 1, role: UserRoles.VIEWER, orgs: ['org1'] };
      const mockRecords = [{ id: 1, organizationId: 'org1' }];
      mockPatientRecordsService.findAll.mockResolvedValue(mockRecords);

      const result = await controller.findAll({ user: mockUser } as any);
      expect(result).toEqual(mockRecords);
      expect(patientRecordsService.findAll).toHaveBeenCalledWith(['org1']);
    });

    it('should forbid access with invalid role', async () => {
      const mockUser = { userId: 1, role: UserRoles.VIEWER, orgs: ['org1'] };
      mockPatientRecordsService.findAll.mockRejectedValue(
        new ForbiddenException(),
      );

      await expect(
        controller.findAll({ user: mockUser } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('GET /patient-records/:id', () => {
    it('should allow access to record in user organization', async () => {
      const mockUser = { userId: 1, role: UserRoles.VIEWER, orgs: ['org1'] };
      const mockRecord = { id: 1, organizationId: 'org1' };
      mockPatientRecordsService.findOne.mockResolvedValue(mockRecord);

      const result = await controller.findOne(1, { user: mockUser } as any);
      expect(result).toEqual(mockRecord);
      expect(patientRecordsService.findOne).toHaveBeenCalledWith(1, ['org1']);
    });

    it('should forbid access to record outside organization', async () => {
      const mockUser = { userId: 1, role: UserRoles.VIEWER, orgs: ['org2'] };
      mockPatientRecordsService.findOne.mockRejectedValue(
        new ForbiddenException(),
      );

      await expect(
        controller.findOne(1, { user: mockUser } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('POST /patient-records', () => {
    it('should create record in authorized organization', async () => {
      const mockUser = { userId: 1, role: UserRoles.ADMIN, orgs: ['org1'] };
      const newRecord = { organizationId: 'org1', medicalData: {} };

      await controller.create(newRecord, { user: mockUser } as any);
      expect(patientRecordsService.create).toHaveBeenCalledWith(
        newRecord,
        expect.objectContaining({ id: 1 }),
      );
    });

    it('should reject creation in unauthorized organization', async () => {
      const mockUser = { userId: 1, role: UserRoles.ADMIN, orgs: ['org1'] };
      const newRecord = { organizationId: 'org2', medicalData: {} };

      await expect(
        controller.create(newRecord, { user: mockUser } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('PATCH /patient-records/:id', () => {
    it('should update record in authorized organization', async () => {
      const mockUser = { userId: 1, role: UserRoles.ADMIN, orgs: ['org1'] };
      const mockRecord = { id: 1, organizationId: 'org1' };
      mockPatientRecordsService.findOne.mockResolvedValue(mockRecord);

      await controller.update(1, {}, { user: mockUser } as any);
      expect(patientRecordsService.update).toHaveBeenCalledWith(
        1,
        {},
        expect.any(Object),
        ['org1'],
      );
    });

    it('should forbid update of non-existent record', async () => {
      const mockUser = { userId: 1, role: UserRoles.ADMIN, orgs: ['org1'] };
      mockPatientRecordsService.findOne.mockResolvedValue(null);

      await expect(
        controller.update(1, {}, { user: mockUser } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle user with multiple organizations', async () => {
      const mockUser = {
        userId: 1,
        role: UserRoles.VIEWER,
        orgs: ['org1', 'org2'],
      };
      const mockRecords = [
        { id: 1, organizationId: 'org1' },
        { id: 2, organizationId: 'org2' },
      ];
      mockPatientRecordsService.findAll.mockResolvedValue(mockRecords);

      const result = await controller.findAll({ user: mockUser } as any);
      expect(result).toHaveLength(2);
    });

    it('should validate user org membership on creation', async () => {
      const mockUser = { userId: 1, role: UserRoles.ADMIN, orgs: ['org1'] };
      const newRecord = { organizationId: 'org3', medicalData: {} };

      await expect(
        controller.create(newRecord, { user: mockUser } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
