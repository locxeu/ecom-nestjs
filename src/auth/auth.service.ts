import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma/prisma.service'
import { LoginBodyDto, RegisterBodyDto } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'
import { LoginBodyType, RegisterBodyType, SendOTPType } from './auth.model'
import { AuthRepository } from './auth.repo'
import { RolesService } from './roles.services'
import { isUniqueConstraintPrismaError } from 'src/shared/helper'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly rolesService: RolesService,
  ) { }
  async register(body: RegisterBodyType) {
    try {
      const roleId = await this.rolesService.getRoleById()
      const hashedPassword = await this.hashingService.hash(body.password)
      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        password: hashedPassword,
        phoneNumber: body.phoneNumber,
        roleId: roleId,
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists')
      }
    }

  }

  // async login(body: LoginBodyType) {
  //   const user = await this.prismaService.user.findFirst({
  //     where: { email: body.email },
  //   })
  //   console.log(user, 'user')
  //   if (!user) {
  //     throw new UnauthorizedException('User not found')
  //   }
  //   const isPasswordValid = await this.hashingService.compare(body.password, user.password)
  //   if (!isPasswordValid) {
  //     throw new UnprocessableEntityException([
  //       {
  //         field: 'password',
  //         message: 'Password is incorrect',
  //       },
  //     ])
  //   }

  //   const tokens = this.generateTokens(user.id.toString())
  //   return {
  //     tokens,
  //   }
  // }

  generateTokens(userId: string) {
    const payload = { userId }
    const accessToken = this.tokenService.signAccessToken(payload)
    const refreshToken = this.tokenService.signRefreshToken(payload)
    return { accessToken, refreshToken }
  }

  // async profile(userId: number) {
  //   const user = await this.prismaService.user.findUniqueOrThrow({
  //     where: { id: userId },
  //     omit: {
  //       password: true,
  //     },
  //   })
  //   return user
  // }

  async sendOTP(body: SendOTPType) {

    return {
      body
    }
  }
}
