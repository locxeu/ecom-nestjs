import { ConflictException } from '@nestjs/common'
import { AuthService } from '../../src/auth/auth.service'
import { EmailAlreadyExistsError } from '../../src/auth/domain/user'

describe('AuthService registration', () => {
  const body = { email: 'user@example.com', name: 'User', password: 'secret123', confirmPassword: 'secret123', phoneNumber: '0901234567' }
  let service: AuthService
  let repository: { findByEmail: jest.Mock; findCredentialsByEmail: jest.Mock; createUser: jest.Mock }
  let hashing: { hash: jest.Mock }
  let roles: { getRoleByName: jest.Mock }

  beforeEach(() => {
    repository = { findCredentialsByEmail: jest.fn(), findByEmail: jest.fn().mockResolvedValue(null), createUser: jest.fn().mockResolvedValue({ id: 1 }) }
    hashing = { hash: jest.fn().mockResolvedValue('hashed-password') }
    roles = { getRoleByName: jest.fn().mockResolvedValue({ id: 2, name: 'CLIENT' }) }
    service = new AuthService(hashing as any, {} as any, repository, roles as any)
  })

  it('stores a hashed password with the client role and no confirmation field', async () => {
    await expect(service.register(body)).resolves.toEqual({ id: 1 })
    expect(roles.getRoleByName).toHaveBeenCalledWith('CLIENT')
    expect(repository.createUser).toHaveBeenCalledWith({ email: body.email, name: body.name, phoneNumber: body.phoneNumber, password: 'hashed-password', roleId: 2 })
  })

  it('rejects an existing email before hashing or writing', async () => {
    repository.findByEmail.mockResolvedValue({ id: 1 })
    await expect(service.register(body)).rejects.toBeInstanceOf(ConflictException)
    expect(hashing.hash).not.toHaveBeenCalled()
    expect(repository.createUser).not.toHaveBeenCalled()
  })

  it('handles a concurrent duplicate insert', async () => {
    repository.createUser.mockRejectedValue(new EmailAlreadyExistsError())
    await expect(service.register(body)).rejects.toBeInstanceOf(ConflictException)
  })

  it('propagates unexpected storage errors', async () => {
    const error = new Error('Database unavailable')
    repository.createUser.mockRejectedValue(error)
    await expect(service.register(body)).rejects.toBe(error)
  })
})


describe('AuthService login credentials', () => {
  const body = { email: 'user@example.com', password: 'secret123', confirmPassword: 'secret123' }
  const credentials = { id: 1, email: body.email, password: 'stored-hash' }
  const repository = { findByEmail: jest.fn(), createUser: jest.fn(), findCredentialsByEmail: jest.fn() }
  const hashing = { compare: jest.fn() }
  const tokens = { signAccessToken: jest.fn(), signRefreshToken: jest.fn() }
  let service: AuthService

  beforeEach(() => {
    jest.clearAllMocks()
    repository.findCredentialsByEmail.mockResolvedValue(credentials)
    hashing.compare.mockResolvedValue(true)
    tokens.signAccessToken.mockReturnValue('access')
    tokens.signRefreshToken.mockReturnValue('refresh')
    service = new AuthService(hashing as any, tokens as any, repository, {} as any)
  })

  it('checks the stored hash and excludes it from the response', async () => {
    const result = await service.login(body)
    expect(hashing.compare).toHaveBeenCalledWith(body.password, 'stored-hash')
    expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh', user: { id: 1, email: body.email } })
    expect(result.user).not.toHaveProperty('password')
  })

  it('does not issue tokens for an incorrect password', async () => {
    hashing.compare.mockResolvedValue(false)
    await expect(service.login(body)).rejects.toThrow('Invalid password')
    expect(tokens.signAccessToken).not.toHaveBeenCalled()
  })

  it('does not compare a password or issue tokens when the account is absent', async () => {
    repository.findCredentialsByEmail.mockResolvedValue(null)
    await expect(service.login(body)).rejects.toThrow('User not found')
    expect(hashing.compare).not.toHaveBeenCalled()
    expect(tokens.signAccessToken).not.toHaveBeenCalled()
  })
})
