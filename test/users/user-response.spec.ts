import { UserResponseSchema } from '../../src/users/dto/user-response.schema'
import { PrismaUserRepository } from '../../src/users/infrastructure/persistence/prisma/repositories/user.repository'

describe('User profile privacy', () => {
  it('strips password, secret and other internal fields from response', () => {
    const result = UserResponseSchema.parse({ id: 5, name: 'John', email: 'test@example.com', phoneNumber: '+1234567890', avatar: null, password: 'hash', totpSecret: 'secret', roleId: 1 })
    expect(result).toEqual({ id: 5, name: 'John', email: 'test@example.com', phoneNumber: '+1234567890', avatar: null })
  })

  it('does not select credentials when reading a profile', async () => {
    const findFirst = jest.fn().mockResolvedValue(null)
    const repository = new PrismaUserRepository({ user: { findFirst } } as any)
    await repository.findUserById(5)
    const query = findFirst.mock.calls[0][0]
    expect(query.select).not.toHaveProperty('password')
    expect(query.select).not.toHaveProperty('totpSecret')
  })
})
