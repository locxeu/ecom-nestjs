import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import envConfig from '../../shared/config'
import type { AuthenticatedUser } from './types/jwt-payload.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envConfig.JWT_SECRET,
      algorithms: ['HS256'],
      ignoreExpiration: false,
    })
  }

  validate(payload: { userId?: unknown }): AuthenticatedUser {
    if (typeof payload.userId !== 'string' || !/^[1-9]\d*$/.test(payload.userId)) {
      throw new UnauthorizedException('Invalid token payload')
    }
    const userId = Number(payload.userId)
    if (!Number.isSafeInteger(userId)) {
      throw new UnauthorizedException('Invalid user ID')
    }
    return { userId }
  }
}
