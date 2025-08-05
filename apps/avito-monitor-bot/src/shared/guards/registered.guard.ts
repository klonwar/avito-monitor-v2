import { TelegrafExecutionContext } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { Repository } from 'typeorm'

import { CanActivate, ExecutionContext, mixin } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from '~/entities/user/models/user.model'

import { GuardException } from '../exceptions/guard.exception'

class RegisteredGuardMixin implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const tg = TelegrafExecutionContext.create(executionContext)
    const botContext = tg.getContext<Context>()
    const user = await this.userRepository.findOneBy({
      id: botContext.from!.id,
    })

    if (!user) {
      throw new GuardException(`Please run /start command first`)
    }

    return true
  }
}

export const RegisteredGuard = mixin(RegisteredGuardMixin)
