import { Injectable } from '@nestjs/common';
import { PatientRecordsRepository } from './patient-records.reporsitory';
import { User } from 'src/users/users.entity';
import { PatientRecord } from './patient-records.entity';

@Injectable()
export class PatientRecordsService {
  constructor(private readonly repository: PatientRecordsRepository) {}

  async findAll(orgIds: string[]) {
    return this.repository.findByOrganizationIds(orgIds);
  }

  async findOne(id: number, orgIds: string[]) {
    return this.repository.findOneByIdAndOrg(id, orgIds);
  }

  async create(data: Partial<PatientRecord>, user: User) {
    return this.repository.createRecord({
      ...data,
      organizationId: data.organizationId || user.organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user,
      updatedBy: user,
    });
  }

  async update(
    id: number,
    data: Partial<PatientRecord>,
    user: User,
    orgIds: string[],
  ) {
    return this.repository.updateRecord(
      id,
      {
        ...data,
        updatedAt: new Date(),
        updatedBy: user,
      },
      orgIds,
    );
  }
}
