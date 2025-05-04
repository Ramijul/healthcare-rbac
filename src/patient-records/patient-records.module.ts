import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PatientRecord } from './patient-records.entity';
import { PatientRecordsController } from './patient-records.controller';
import { PatientRecordsService } from './patient-records.service';
import { PatientRecordsRepository } from './patient-records.reporsitory';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([PatientRecord]),
    UsersModule,
  ],
  controllers: [PatientRecordsController],
  providers: [PatientRecordsService, PatientRecordsRepository],
  exports: [PatientRecordsService],
})
export class PatientRecordsModule {}
