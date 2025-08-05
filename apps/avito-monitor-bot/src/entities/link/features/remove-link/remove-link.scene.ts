import { Action, Ctx, Scene, SceneEnter, Sender, Start } from 'nestjs-telegraf'
import { type SceneContext } from 'telegraf/scenes'
import { Repository } from 'typeorm'

import { Logger, UseFilters } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Link } from '~/entities/link/models/link.model'
import { User } from '~/entities/user/models/user.model'
import { BotScene } from '~/shared/constants/bot.constants'
import { AnyExceptionFilter } from '~/shared/filters/any-exception.filter'
import type { TelegramUser } from '~/shared/types/telegram.types'

import { RemoveLinkAction, RemoveLinkKeyboard } from './remove-link.constants'

@Scene(BotScene.REMOVE_LINK)
export class RemoveLinkScene {
  private readonly logger = new Logger(RemoveLinkScene.name)

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  @Start()
  public async onStart(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.leave()
    await ctx.scene.enter(BotScene.REGISTRATION)
  }

  @Action(RemoveLinkAction.CANCEL)
  public async cancel(@Ctx() context: SceneContext): Promise<void> {
    await context.scene.leave()
    await context.scene.enter(BotScene.INFO)
  }

  @SceneEnter()
  @UseFilters(AnyExceptionFilter)
  async enter(@Ctx() context: SceneContext, @Sender() sender: TelegramUser) {
    const user = await this.userRepository.findOneBy({ id: sender.id })

    if (!user?.links.length) {
      await context.reply('You have no links to remove', {
        reply_markup: {
          inline_keyboard: RemoveLinkKeyboard,
        },
      })
      return
    }

    await context.reply(`Please, select the link`, {
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [
          ...user.links.map((link) => [
            {
              text: link.url.replace('https://www.avito.ru', ''),
              callback_data: `${RemoveLinkAction.UNSUBSCRIBE}:${link.id}`,
            },
          ]),
          ...RemoveLinkKeyboard,
        ],
      },
    })
  }

  @Action(new RegExp(`^${RemoveLinkAction.UNSUBSCRIBE}:(\\d+)$`))
  async unsubscribe(@Ctx() context: SceneContext, @Sender() sender: TelegramUser) {
    const id = parseInt((context as any).match[1])

    const user = await this.userRepository.findOneBy({ id: sender.id })
    const existingLink = await this.linkRepository.findOne({
      where: { id, user: { id: user!.id } },
      relations: ['user'],
    })

    if (!existingLink) {
      await context.reply('No such link found', {
        reply_markup: {
          inline_keyboard: RemoveLinkKeyboard,
        },
      })
      return
    }

    existingLink.remove()
    await context.reply('⛓️‍💥 Success! You will no longer receive notifications for this link')
    await context.scene.leave()
  }
}
