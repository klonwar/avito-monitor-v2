import { Action, Ctx, Hears, Message, Scene, SceneEnter, Sender, Start } from 'nestjs-telegraf'
import { type SceneContext } from 'telegraf/scenes'
import { Repository } from 'typeorm'

import { Logger, UseFilters } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Link } from '~/entities/link/models/link.model'
import { User } from '~/entities/user/models/user.model'
import { BotScene } from '~/shared/constants/bot.constants'
import { AnyExceptionFilter } from '~/shared/filters/any-exception.filter'
import type { TelegramUser } from '~/shared/types/telegram.types'

import { AddLinkAction, AddLinkActionToDescription, AddLinkKeyboard } from './add-link.constants'

@Scene(BotScene.ADD_LINK)
export class AddLinkScene {
  private readonly logger = new Logger(AddLinkScene.name)

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

  @Action(AddLinkAction.CANCEL)
  public async cancel(@Ctx() context: SceneContext): Promise<void> {
    await context.scene.leave()
    await context.scene.enter(BotScene.INFO)
  }

  @SceneEnter()
  @UseFilters(AnyExceptionFilter)
  async enter(@Ctx() context: SceneContext, @Sender() sender: TelegramUser) {
    const user = await this.userRepository.findOneBy({ id: sender.id })
    if (user && user.links.length >= 5) {
      this.logger.warn(`User ${user.id} tried to add more than 5 links`)
      await context.reply('You can only add up to 5 links. Please, remove some links before adding new ones.')
      await context.scene.leave()
      return
    }

    await context.reply(`Please, send the link in format\n\`https://www.avito.ru/a/b/c?d=e...\``, {
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: AddLinkKeyboard,
      },
    })
  }

  @UseFilters(AnyExceptionFilter)
  @Hears(/^https:\/\/www\.avito\.ru(?:\/.*)?$/)
  @UseFilters(AnyExceptionFilter)
  async link(@Ctx() context: SceneContext, @Message('text') url: string, @Sender() sender: TelegramUser) {
    const user = await this.userRepository.findOneBy({ id: sender.id })
    const existingLink = await this.linkRepository.findOne({
      where: { user: { id: sender.id }, url },
      relations: ['user'],
    })

    if (existingLink) {
      await context.reply(`Already subscribed. Do you want to unsubscribe?`, {
        reply_markup: {
          inline_keyboard: [
            ...AddLinkKeyboard,
            [
              {
                text: AddLinkActionToDescription[AddLinkAction.UNSUBSCRIBE],
                callback_data: `${AddLinkAction.UNSUBSCRIBE}:${existingLink.id}`,
              },
            ],
          ],
        },
      })
      return
    }

    const link = new Link()
    link.user = user!
    link.url = url
    await link.save()

    await context.reply('🎉 Success! We will notify you if something changes')
    await context.scene.leave()
  }

  @Action(new RegExp(`^${AddLinkAction.UNSUBSCRIBE}:(\\d+)$`))
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
          inline_keyboard: AddLinkKeyboard,
        },
      })
      return
    }

    existingLink.remove()
    await context.reply('⛓️‍💥 Success! You will no longer receive notifications for this link')
    await context.scene.leave()
  }

  @Hears(/.*/)
  @UseFilters(AnyExceptionFilter)
  async wrong(@Ctx() context: SceneContext) {
    await context.reply('Wrong format, example: `https://www.avito.ru/a/b/c?d=e...`', {
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: AddLinkKeyboard,
      },
    })
  }
}
