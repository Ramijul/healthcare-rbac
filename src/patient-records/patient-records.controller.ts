import {
  Controller,
  Get,
  Req,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PatientRecordsService } from './patient-records.service';
import { UserRoles } from 'src/roles/roles.constants';
import { RequireRole } from 'src/users/auth/decorators/require-role.decorator';
import { UserIdentity } from 'src/users/auth/auth.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { CreateRecordDTO } from './patient-records.dto';

@Controller('patient-records')
export class PatientRecordsController {
  constructor(
    private readonly service: PatientRecordsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @RequireRole(UserRoles.VIEWER)
  async findAll(@Req() req: Request) {
    const userIdentity = req['user'] as UserIdentity;

    return this.service.findAll(userIdentity.orgs);
  }

  @Get(':id')
  @RequireRole(UserRoles.VIEWER)
  async findOne(@Param('id') id: number, @Req() req: Request) {
    const userIdentity = req['user'] as UserIdentity;

    return this.service.findOne(id, userIdentity.orgs);
  }

  @Post()
  @RequireRole(UserRoles.ADMIN)
  async create(@Body() data: CreateRecordDTO, @Req() req: Request) {
    const userIdentity = req['user'] as UserIdentity;
    const user = (await this.usersService.findById(
      userIdentity.userId,
    )) as User;

    //explicit org check is needed when creating new resource
    if (
      !data.organizationId ||
      !userIdentity.orgs.includes(data.organizationId)
    ) {
      throw new ForbiddenException();
    }

    return this.service.create(data, user);
  }

  @Patch(':id')
  @RequireRole(UserRoles.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() data: any,
    @Req() req: Request,
  ) {
    const userIdentity = req['user'] as UserIdentity;
    const user = (await this.usersService.findById(
      userIdentity.userId,
    )) as User;

    const record = await this.service.findOne(id, userIdentity.orgs);

    if (!record) {
      throw new ForbiddenException();
    }

    return this.service.update(id, data, user, userIdentity.orgs);
  }
}
