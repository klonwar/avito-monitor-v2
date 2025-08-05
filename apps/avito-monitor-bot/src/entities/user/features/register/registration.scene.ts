import { Ctx, Scene, SceneEnter, Sender } from 'nestjs-telegraf'
import type { SceneContext } from 'telegraf/scenes'
import { Repository } from 'typeorm'

import { Logger, UseFilters } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { BotScene } from '~/shared/constants/bot.constants'
import { AnyExceptionFilter } from '~/shared/filters/any-exception.filter'
import type { TelegramUser } from '~/shared/types/telegram.types'

import { User } from '../../models/user.model'

@Scene(BotScene.REGISTRATION)
export class RegistrationScene {
  private readonly logger = new Logger(RegistrationScene.name)

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @SceneEnter()
  @UseFilters(AnyExceptionFilter)
  async enter(@Ctx() context: SceneContext, @Sender() sender: TelegramUser) {
    const user = await this.userRepository.findOneBy({ id: sender.id })

    if (!user) {
      const user = this.userRepository.create({
        ...context.from,
      })
      await this.userRepository.save(user)

      const message = `User @${user.username ?? user.id} registered`
      this.logger.log(message)
      await context.reply(message)
    }

    await context.scene.leave()
    await context.scene.enter(BotScene.INFO)
  }
}
