import { createZodDto } from 'nestjs-zod/dto'
import { LoginBodySchema, RegisterBodySchema, RegisterResponseSchema, SendOTPBodySchema } from '../auth.model'


export class RegisterBodyDto extends createZodDto(RegisterBodySchema) { }
export class LoginBodyDto extends createZodDto(LoginBodySchema) { }
export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) { }
export class SendOTPBodyDto extends createZodDto(SendOTPBodySchema) { }
