import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDto, RegisterBodyDto, RegisterResponseDto, SendOTPBodyDto } from './dto/auth.dto'
import { AuthGuard } from 'src/shared/guards/access-token.guard'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ZodSerializerDto(RegisterResponseDto)
  async register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }

  @Post('send-otp')
  async sendOTP(@Body() body: SendOTPBodyDto) {
    return this.authService.sendOTP(body)
  }

  // Login will be implemented in a separate step.
  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    return this.authService.login(body)
  }

  // @Get('profile')
  // @UseGuards(AuthGuard)
  // async profile(@Request() req) {
  //   return this.authService.profile(Number(req.user.userId))
  // }
}
