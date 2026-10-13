import { Injectable } from "@nestjs/common";
import { AuthUser } from "src/auth/domain/user";
import { PrismaService } from "src/shared/services/prisma/prisma.service";
import { UpdateUserProfileInput } from "src/users/domain/update-user-profile.input";
import { UserRepository } from "../../user.repository";

@Injectable()
export class PrismaUserRepository implements UserRepository {

    constructor(private readonly prismaService: PrismaService) { }
    async findUserById(id: number): Promise<AuthUser | null> {
        return await this.prismaService.user.findFirst({
            where: {
                id,
                deletedAt: null,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
                avatar: true,
                roleId: true,
                createdById: true,
                updatedById: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        })
    }

    async updateUserProfile(id: number, data: UpdateUserProfileInput): Promise<AuthUser> {
        return await this.prismaService.user.update({
            where: { id },
            data,
        })
    }
}