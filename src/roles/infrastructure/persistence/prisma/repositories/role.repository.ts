import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../../shared/services/prisma/prisma.service'
import { RoleRepository } from '../../role.repository'

@Injectable()
export class PrismaRoleRepository extends RoleRepository {
  constructor(private readonly prisma: PrismaService) { super() }

  findByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
      select: { id: true, name: true },
    })
  }
}
