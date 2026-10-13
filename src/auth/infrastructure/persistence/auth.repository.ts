import type { AuthCredentials, AuthUser, CreateAuthUser } from '../../domain/user'

export abstract class AuthRepository {
  abstract findByEmail(email: string): Promise<AuthUser | null>
  abstract findCredentialsByEmail(email: string): Promise<AuthCredentials | null>
  abstract createUser(data: CreateAuthUser): Promise<AuthUser>
}
