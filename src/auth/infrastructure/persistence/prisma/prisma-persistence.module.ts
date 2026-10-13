import { Module } from '@nestjs/common'
import { SharedModule } from '../../../../shared/shared.module'
import { AuthRepository } from '../auth.repository'
import { PrismaAuthRepository } from './repositories/auth.repository'

@Module({
  imports: [SharedModule],
  providers: [{ provide: AuthRepository, useClass: PrismaAuthRepository }],
  exports: [AuthRepository],
})
export class PrismaAuthPersistenceModule {}
