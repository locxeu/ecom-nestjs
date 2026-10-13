import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import request from 'supertest'
import { AuthController } from '../../src/auth/auth.controller'
import { AuthService } from '../../src/auth/auth.service'

describe('Auth HTTP validation', () => {
  let app: INestApplication
  const service = { register: jest.fn().mockResolvedValue({ id: 1 }), sendOTP: jest.fn(), login: jest.fn().mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' }) }
  const body = { email: 'user@example.com', name: 'User', password: 'secret123', confirmPassword: 'secret123', phoneNumber: '0901234567' }

  beforeAll(async () => {
    const module = await Test.createTestingModule({ controllers: [AuthController], providers: [{ provide: AuthService, useValue: service }] }).compile()
    app = module.createNestApplication()
    app.useGlobalPipes(new ZodValidationPipe())
    await app.init()
  })
  beforeEach(() => jest.clearAllMocks())
  afterAll(async () => { await app.close() })

  it('routes login to the auth service', async () => {
    await request(app.getHttpServer()).post('/auth/login').send({ email: body.email, password: body.password }).expect(201)
    expect(service.login).toHaveBeenCalledWith({ email: body.email, password: body.password })
  })

  it('accepts a valid registration', async () => {
    await request(app.getHttpServer()).post('/auth/register').send(body).expect(201)
    expect(service.register).toHaveBeenCalledWith(body)
  })

  it.each([{ email: 'invalid' }, { confirmPassword: 'different' }])('rejects invalid input before the service', async (change) => {
    await request(app.getHttpServer()).post('/auth/register').send({ ...body, ...change }).expect(400)
    expect(service.register).not.toHaveBeenCalled()
  })
})
