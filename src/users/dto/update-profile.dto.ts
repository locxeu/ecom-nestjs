import { createZodDto } from 'nestjs-zod'
import { UpdateUserSchema } from './user-response.schema'

export class UpdateUserProfileDto extends createZodDto(
    UpdateUserSchema
) { }