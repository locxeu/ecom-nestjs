import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { REQUEST_USER_KEY } from '../constants/auth.constants'
import { TokenService } from '../services/token.service'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const accessToken = request.headers?.authorization?.split(' ')[1]
    if (!accessToken) {
      throw new UnauthorizedException('Access token is required')
    }
    try {
      const decoded = await this.tokenService.verifyingAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decoded
      return true
    } catch {
      return false
    }
  }
}
