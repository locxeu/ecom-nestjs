import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserRepository } from './infrastructure/persistence/user.repository'
import type { AuthUser } from '../auth/domain/user'
import { UpdateUserProfileInput } from './domain/update-user-profile.input'

@Injectable()
export class UsersService {
    constructor(private readonly users: UserRepository) { }

    async getMe(userId: number): Promise<AuthUser> {
        const user = await this.users.findUserById(userId)

        if (!user) {
            throw new UnauthorizedException(
                'Account is no longer available',
            )
        }

        return user
    }

    async updateUserProfile(userId: number, data: UpdateUserProfileInput): Promise<AuthUser> {
        const user = await this.users.updateUserProfile(userId, data)
        if (!user) {
            throw new UnauthorizedException(
                'Account is no longer available',
            )
        }
        return user;
    }
}