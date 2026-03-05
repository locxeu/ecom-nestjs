import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma/prisma.service'
import { LoginBodyDto, RegisterBodyDto } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) { }
  async register(body: RegisterBodyDto) {
    const hashedPassword = await this.hashingService.hash(body.password)
    const user = await this.prismaService.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
        phoneNumber: body.phoneNumber,
        roleId: 1, // TODO: Set appropriate default role or get from body
      },
    })
    return user
  }

  async login(body: LoginBodyDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: body.email },
    })
    console.log(user, 'user')
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    const isPasswordValid = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          message: 'Password is incorrect',
        },
      ])
    }

    const tokens = this.generateTokens(user.id.toString())
    return {
      tokens,
    }
  }

  generateTokens(userId: string) {
    const payload = { userId }
    const accessToken = this.tokenService.signAccessToken(payload)
    const refreshToken = this.tokenService.signRefreshToken(payload)
    return { accessToken, refreshToken }
  }

  async profile(userId: number) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      omit: {
        password: true,
      },
    })
    return user
  }
}
