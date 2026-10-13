import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RolesModule } from '../roles/roles.module'
import { PrismaAuthPersistenceModule } from './infrastructure/persistence/prisma/prisma-persistence.module'

@Module({
  imports: [PassportModule, RolesModule, PrismaAuthPersistenceModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
