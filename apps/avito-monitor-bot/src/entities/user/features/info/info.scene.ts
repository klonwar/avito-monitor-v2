import { Ctx, Scene, SceneEnter, Sender } from 'nestjs-telegraf'
import type { SceneContext } from 'telegraf/scenes'
import { Repository } from 'typeorm'

import { Logger, UseFilters } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { BotCommand, BotScene } from '~/shared/constants/bot.constants'
import { AnyExceptionFilter } from '~/shared/filters/any-exception.filter'
import type { TelegramUser } from '~/shared/types/telegram.types'

import { User } from '../../models/user.model'

@Scene(BotScene.INFO)
export class InfoScene {
  private readonly logger = new Logger(InfoScene.name)

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @SceneEnter()
  @UseFilters(AnyExceptionFilter)
  async enter(@Ctx() context: SceneContext, @Sender() sender: TelegramUser) {
    const user = await this.userRepository.findOneBy({ id: sender.id })

    await context.reply(
      `Welcome, @${sender.username ?? sender.id}! You have ${user?.links.length ?? 0} subscriptions.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🔗 My subscriptions',
                callback_data: BotCommand.CONFIGURE_LINKS,
              },
            ],
          ],
        },
      },
    )
    await context.scene.leave()
  }
}
