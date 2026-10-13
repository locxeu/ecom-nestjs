import { Module } from '@nestjs/common'
import { PrismaRolePersistenceModule } from './infrastructure/persistence/prisma/prisma-persistence.module'
import { RolesService } from './roles.service'

@Module({
  imports: [PrismaRolePersistenceModule],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
