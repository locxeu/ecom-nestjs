import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaUserPersistenceModule } from './infrastructure/persistence/prisma/prisma-persistence.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    AuthModule,
    PrismaUserPersistenceModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }