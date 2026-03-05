import { z } from 'zod'
import { createZodDto } from 'nestjs-zod/dto'

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

// Register Schema
export const RegisterDto = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords and Confirm Password do not match',
        path: ['confirmPassword'],
      })
    }
  })

export class RegisterBodyDto extends createZodDto(RegisterDto) {}
export class LoginBodyDto extends createZodDto(loginSchema) {}
