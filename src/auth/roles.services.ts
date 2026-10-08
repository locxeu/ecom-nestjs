import { Injectable } from "@nestjs/common"
import { Role } from "src/shared/constants/role.constants"
import { PrismaService } from "src/shared/services/prisma/prisma.service"


@Injectable()
export class RolesService {
    private clientRoleId: number | null = null
    constructor(private readonly prismaService: PrismaService) { }
    async getRoleById() {
        if (this.clientRoleId) return this.clientRoleId
        const role = await this.prismaService.role.findUniqueOrThrow({
            where: { name: Role.CLIENT },
        })
        this.clientRoleId = role.id
        return role.id
    }
}