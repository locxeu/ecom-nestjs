import envConfig from 'src/shared/config'
import { Role } from 'src/shared/constants/role.constants'
import { PrismaService } from 'src/shared/services/prisma/prisma.service'

const prisma = new PrismaService()

const main = async () => {
  const roleCount = await prisma.role.count()
  if (roleCount > 0) {
    console.log('Roles already exist')
    return
  }
  const roles = await prisma.role.createMany({
    data: [
      { name: Role.ADMIN, description: 'Admin role' },
      { name: Role.USER, description: 'User role' },
      { name: Role.SELLER, description: 'Seller role' },
    ],
  })
  const adminRole = await prisma.role.findFirstOrThrow({
    where: { name: Role.ADMIN },
  })
  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: envConfig.ADMIN_PASSWORD,
      roleId: adminRole.id,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
    },
  })
  return { createRoleCount: roles.count, adminUser }
}

main()
  .then((result) => {
    if (result) {
      const { createRoleCount, adminUser } = result
      console.log('Initialization complete')
      console.log('Created roles:', createRoleCount)
      console.log('Admin user:', adminUser)
    } else {
      console.log('Initialization complete - roles already exist')
    }
  })
  .catch((error) => {
    console.error('Initialization failed', error)
  })
