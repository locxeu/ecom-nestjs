import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { HashingService } from '../shared/services/hashing.service'
import { TokenService } from '../shared/services/token.service'
import { Role } from '../shared/constants/role.constants'
import type { LoginBodyType, RegisterBodyType, SendOTPType } from './auth.model'
import { AuthRepository } from './infrastructure/persistence/auth.repository'
import { EmailAlreadyExistsError } from './domain/user'
import { RolesService } from '../roles/roles.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly rolesService: RolesService,
  ) { }

  async register(body: RegisterBodyType) {
    if (await this.authRepository.findByEmail(body.email)) {
      throw new ConflictException('Email already exists')
    }
    const role = await this.rolesService.getRoleByName(Role.CLIENT)
    const password = await this.hashingService.hash(body.password)
    try {
      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        password,
        phoneNumber: body.phoneNumber,
        roleId: role.id,
      })
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictException('Email already exists')
      }
      throw error
    }
  }

  generateTokens(userId: string) {
    const payload = { userId }
    return {
      accessToken: this.tokenService.signAccessToken(payload),
      refreshToken: this.tokenService.signRefreshToken(payload),
    }
  }

  async sendOTP(body: SendOTPType) {
    return { body }
  }

  async login(body: LoginBodyType) {
    const credentials = await this.authRepository.findCredentialsByEmail(body.email)
    if (!credentials) {
      throw new UnauthorizedException('User not found')
    }
    const isPasswordValid = await this.hashingService.compare(body.password, credentials.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
    }
    const { password: _password, ...user } = credentials
    const tokens = this.generateTokens(user.id.toString())
    return { ...tokens, user }
  }
}
