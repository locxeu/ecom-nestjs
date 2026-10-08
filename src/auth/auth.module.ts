import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repo'
import { AuthService } from './auth.service'
import { RolesService } from './roles.services'

@Module({
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, RolesService],
})
export class AuthModule { }
