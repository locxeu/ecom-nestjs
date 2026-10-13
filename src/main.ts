import { Reflector } from '@nestjs/core'
import { NestFactory } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ZodValidationPipe())
  app.useGlobalInterceptors(new ZodSerializerInterceptor(app.get(Reflector)))
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
