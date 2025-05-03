import { UserRole } from 'src/roles/roles.constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  // TODO: use many-to-one relation with Organization entity
  @Column({ name: 'organization_id' })
  organizationId: string;
}
