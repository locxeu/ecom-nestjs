import { z } from 'zod'

export const UserResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    avatar: z.string().nullable(),
})

export const UpdateUserSchema = UserResponseSchema.pick({
    name: true,
    phoneNumber: true,
    avatar: true,
}).extend({
    name: z.string().trim().min(3).max(100),
    phoneNumber: z.string().trim().min(9).max(15),
    avatar: z.url().nullable()
}).partial().strict().refine((data) => {
    if (!data.name && !data.phoneNumber && !data.avatar) {
        return false
    }
    return true
}, { message: 'At least one field must be provided' })


export type TUserResponse = z.infer<typeof UserResponseSchema>
export type TUpdateUser = z.infer<typeof UpdateUserSchema>
