import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '../../model/user/user.model'

import { RegistrationScene } from './user/registration.scene'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RegistrationScene],
})
export class ScenesModule {}
