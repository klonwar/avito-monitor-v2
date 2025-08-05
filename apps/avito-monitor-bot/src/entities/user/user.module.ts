import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { InfoScene } from '~/entities/user/features/info/info.scene'
import { RegisterHandler } from '~/entities/user/features/register/register.handler'

import { RegistrationScene } from './features/register/registration.scene'
import { User } from './models/user.model'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RegisterHandler, RegistrationScene, InfoScene],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
