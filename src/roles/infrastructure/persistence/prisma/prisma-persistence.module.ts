import { Module } from '@nestjs/common'
import { SharedModule } from '../../../../shared/shared.module'
import { RoleRepository } from '../role.repository'
import { PrismaRoleRepository } from './repositories/role.repository'

@Module({
  imports: [SharedModule],
  providers: [{ provide: RoleRepository, useClass: PrismaRoleRepository }],
  exports: [RoleRepository],
})
export class PrismaRolePersistenceModule {}
