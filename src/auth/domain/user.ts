export interface AuthUser {
  id: number
  email: string
  name: string
  phoneNumber: string
  avatar: string | null
  roleId: number
  createdById: number | null
  updatedById: number | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface AuthCredentials extends AuthUser {
  password: string
}

export interface CreateAuthUser {
  email: string
  name: string
  password: string
  phoneNumber: string
  roleId: number
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email already exists')
    this.name = 'EmailAlreadyExistsError'
  }
}
