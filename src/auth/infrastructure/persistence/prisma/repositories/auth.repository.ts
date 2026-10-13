import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../../shared/services/prisma/prisma.service'
import { isUniqueConstraintPrismaError } from '../../../../../shared/helper'
import { EmailAlreadyExistsError } from '../../../../domain/user'
import type { AuthCredentials, CreateAuthUser } from '../../../../domain/user'
import { AuthRepository } from '../../auth.repository'

@Injectable()
export class PrismaAuthRepository extends AuthRepository {
  constructor(private readonly prisma: PrismaService) { super() }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      omit: { password: true, totpSecret: true },
    })
  }

  async findCredentialsByEmail(email: string): Promise<AuthCredentials | null> {
    return this.prisma.user.findUnique({
      where: { email },
      omit: { totpSecret: true },
    })
  }

  async createUser(data: CreateAuthUser) {
    try {
      return await this.prisma.user.create({
        data,
        omit: { password: true, totpSecret: true },
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new EmailAlreadyExistsError()
      }
      throw error
    }
  }
}
