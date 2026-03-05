import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

config({
  path: '.env',
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Environment file not found')
  process.exit(1)
}

const configSchema = z.object({
  PORT: z.number().default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.coerce.number(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.coerce.number(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_PHONE_NUMBER: z.string(),
})

const configServer = configSchema.safeParse(process.env)
if (!configServer.success) {
  console.error('Invalid environment variables', configServer.error)
  process.exit(1)
}

const envConfig = configServer.data
export default envConfig
