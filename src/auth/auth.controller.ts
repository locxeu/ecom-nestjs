import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDto, RegisterBodyDto } from './auth.dto'
import { AuthGuard } from 'src/shared/guards/access-token.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    return this.authService.login(body)
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@Request() req) {
    return this.authService.profile(Number(req.user.userId))
  }
}
