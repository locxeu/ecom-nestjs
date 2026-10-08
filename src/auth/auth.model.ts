import { TypeOfVerificationCode } from "src/shared/constants/auth.constants";
import { z } from "zod";

export const UserSchema = z.object({
    id: z.number(),
    email: z.email(),
    name: z.string().min(3).max(100),
    password: z.string().min(6).max(100),
    phoneNumber: z.string().min(9).max(15),
    avatar: z.string().nullable(),
    totpSecret: z.string().nullable(),
    roleId: z.number().positive(),
    createdById: z.number().positive().nullable(),
    updatedById: z.number().positive().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
})

export type UserType = z.infer<typeof UserSchema>

export const RegisterBodySchema = UserSchema.pick({
    email: true,
    name: true,
    password: true,
    phoneNumber: true,
}).extend({
    confirmPassword: z.string().min(6).max(100),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'Passwords and Confirm Password do not match',
            path: ['confirmPassword'],
        })
    }
})

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const LoginBodySchema = UserSchema.pick({
    email: true,
    password: true,
}).extend({
    confirmPassword: z.string().min(6).max(100),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'Passwords and Confirm Password do not match',
            path: ['confirmPassword'],
        })
    }
})

export type LoginBodyType = z.infer<typeof LoginBodySchema>


export const RegisterResponseSchema = UserSchema.omit({
    password: true,
    totpSecret: true,
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>

export const VerifycationCodeSchema = z.object({
    id: z.number(),
    email: z.email(),
    code: z.string().min(6).max(6),
    type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
    createdAt: z.date(),
    expiresAt: z.date(),
})

export type VerifycationCode = z.infer<typeof VerifycationCodeSchema>

export const SendOTPBodySchema = VerifycationCodeSchema.pick({
    email: true,
    type: true,
})

export type SendOTPType = z.infer<typeof SendOTPBodySchema>