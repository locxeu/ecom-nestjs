import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { RoleRepository } from './infrastructure/persistence/role.repository'

@Injectable()
export class RolesService {
  constructor(private readonly roles: RoleRepository) {}

  async getRoleByName(name: string) {
    const role = await this.roles.findByName(name)
    if (!role) {
      throw new InternalServerErrorException('Required role is not configured')
    }
    return role
  }
}
