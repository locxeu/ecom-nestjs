import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { SharedModule } from './shared/shared.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [AuthModule, UsersModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
