import { Action, Command, Ctx, InjectBot, Sender, Start, Update } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import type { SceneContext } from 'telegraf/scenes'

import { Injectable, UseFilters, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'

import { AddLinkCommand } from '~/entities/link/features/add-link/add-link.command'
import { ConfigureLinksCommand } from '~/entities/link/features/configure-links/configure-links.command'
import { ConfigureLinksAction } from '~/entities/link/features/configure-links/configure-links.constants'
import { ListLinksCommand } from '~/entities/link/features/list-links/list-links.command'
import { RemoveLinkCommand } from '~/entities/link/features/remove-link/remove-link.command'
import { RegisterCommand } from '~/entities/user/features/register/register.command'
import { BotCommand, TelegramBotCommands } from '~/shared/constants/bot.constants'
import { AnyExceptionFilter } from '~/shared/filters/any-exception.filter'
import { GuardExceptionFilter } from '~/shared/filters/guard-exception.filter'
import { TypeExceptionFilter } from '~/shared/filters/type-exception.filter'
import { RegisteredGuard } from '~/shared/guards/registered.guard'
import type { TelegramUser } from '~/shared/types/telegram.types'

@Update()
@Injectable()
export class BotUpdate {
  constructor(
    protected readonly commandBus: CommandBus,
    @InjectBot() private bot: Telegraf<SceneContext>,
  ) {
    this.bot.telegram.setMyCommands(TelegramBotCommands)
  }

  @Start()
  @UseFilters(AnyExceptionFilter)
  async start(@Ctx() context: SceneContext) {
    await this.commandBus.execute(new RegisterCommand(context))
  }

  @Command(BotCommand.CONFIGURE_LINKS)
  @Action(BotCommand.CONFIGURE_LINKS)
  @UseFilters(AnyExceptionFilter, TypeExceptionFilter, GuardExceptionFilter)
  @UseGuards(RegisteredGuard)
  async links(@Ctx() context: SceneContext) {
    await this.commandBus.execute(new ConfigureLinksCommand(context))
  }

  @Action(ConfigureLinksAction.ADD)
  @UseFilters(AnyExceptionFilter, TypeExceptionFilter, GuardExceptionFilter)
  @UseGuards(RegisteredGuard)
  async addLink(@Ctx() context: SceneContext) {
    await this.commandBus.execute(new AddLinkCommand(context))
  }

  @Action(ConfigureLinksAction.REMOVE)
  @UseFilters(AnyExceptionFilter, TypeExceptionFilter, GuardExceptionFilter)
  @UseGuards(RegisteredGuard)
  async removeLink(@Ctx() context: SceneContext, @Sender() sender: TelegramUser) {
    await this.commandBus.execute(new RemoveLinkCommand(context, sender))
  }

  @Action(ConfigureLinksAction.LIST)
  @UseFilters(AnyExceptionFilter, TypeExceptionFilter, GuardExceptionFilter)
  @UseGuards(RegisteredGuard)
  async listLinks(@Ctx() context: SceneContext, @Sender() sender: TelegramUser) {
    await this.commandBus.execute(new ListLinksCommand(context, sender))
  }
}
