import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientRecord } from './patient-records.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PatientRecordsRepository {
  constructor(
    @InjectRepository(PatientRecord)
    private readonly repository: Repository<PatientRecord>,
  ) {}

  async findByOrganizationIds(orgIds: string[]): Promise<PatientRecord[]> {
    return this.repository.find({
      where: { organizationId: In(orgIds) },
    });
  }

  async findOneByIdAndOrg(
    id: number,
    orgIds: string[],
  ): Promise<PatientRecord> {
    const record = await this.repository.findOne({
      where: { id, organizationId: In(orgIds) },
    });

    if (!record) {
      throw new NotFoundException(`Patient record with ID ${id} not found`);
    }

    return record;
  }

  async createRecord(data: Partial<PatientRecord>): Promise<PatientRecord> {
    return this.repository.save(data);
  }

  async updateRecord(
    id: number,
    data: Partial<PatientRecord>,
    orgIds: string[],
  ): Promise<PatientRecord> {
    await this.repository.update(id, data);
    return this.findOneByIdAndOrg(id, orgIds);
  }
}
