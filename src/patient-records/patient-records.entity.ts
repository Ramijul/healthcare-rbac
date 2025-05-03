import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PatientRecord {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('jsonb', { name: 'medical_data' })
  medicalData: object;

  // TODO: use many-to-one relation with Organization entity
  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  // other fields including patient and doctor (referencing User)
}
