import {
    Body,
    Controller,
    Get,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ZodSerializerDto } from 'nestjs-zod'
import type { Request } from 'express'
import { UserResponseDto } from './dto/user-response.dto'
import { UsersService } from './users.service'
import type { AuthenticatedUser } from 'src/auth/strategies/types/jwt-payload.type'
import { UpdateUserProfileDto } from './dto/update-profile.dto'

type AuthenticatedRequest = Request & {
    user: AuthenticatedUser
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ZodSerializerDto(UserResponseDto)
    getMe(@Req() request: AuthenticatedRequest) {
        return this.usersService.getMe(request.user.userId)
    }

    @Patch('me')
    @UseGuards(AuthGuard('jwt'))
    @ZodSerializerDto(UserResponseDto)
    updateMe(@Req() request: AuthenticatedRequest, @Body() body: UpdateUserProfileDto) {
        return this.usersService.updateUserProfile(request.user.userId, body)
    }
}