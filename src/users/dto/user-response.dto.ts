import { createZodDto } from 'nestjs-zod'
import { UserResponseSchema } from './user-response.schema'

export class UserResponseDto extends createZodDto(
  UserResponseSchema,
) {}