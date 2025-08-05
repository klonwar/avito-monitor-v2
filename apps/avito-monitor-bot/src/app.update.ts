import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import type { SceneContext } from 'telegraf/scenes'

import { Injectable, UseFilters } from '@nestjs/common'

import { BotService } from './bot/bot.service'
import { AnyExceptionFilter } from './bot/filters/any-exception.filter'

@Update()
@Injectable()
export class AppUpdate {
  constructor(
    @InjectBot() private bot: Telegraf<SceneContext>,
    private botService: BotService,
  ) {
    //bot.telegram.setMyCommands(myCommands)
  }

  @Start()
  @UseFilters(AnyExceptionFilter)
  async start(@Ctx() context: SceneContext) {
    await context.reply('here')
    //await context.scene.enter(BotScene.REGISTRATION)
  }
}
