import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import envConfig from 'src/shared/config'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: { userId: string }) {
    return this.jwtService.sign(payload, {
      secret: envConfig.JWT_SECRET,
      expiresIn: envConfig.JWT_EXPIRES_IN,
      algorithm: 'HS256',
    })
  }

  verifyingAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: envConfig.JWT_SECRET,
    })
  }

  signRefreshToken(payload: { userId: string }) {
    return this.jwtService.sign(payload, {
      secret: envConfig.JWT_REFRESH_SECRET,
      expiresIn: envConfig.JWT_REFRESH_EXPIRES_IN,
      algorithm: 'HS256',
    })
  }

  verifyingRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: envConfig.JWT_REFRESH_SECRET,
    })
  }
}
