import { Module } from '@nestjs/common'
import { SharedModule } from '../../../../shared/shared.module'
import { UserRepository } from '../user.repository'
import { PrismaUserRepository } from './repositories/user.repository'

@Module({
    imports: [SharedModule],
    providers: [
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [UserRepository],
})
export class PrismaUserPersistenceModule { }