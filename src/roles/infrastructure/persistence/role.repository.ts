import type { Role } from '../../domain/role'

export abstract class RoleRepository {
  abstract findByName(name: string): Promise<Role | null>
}
