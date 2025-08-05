import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import type { SceneContext } from 'telegraf/scenes'

import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { MessageService } from './message.service'

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name)

  constructor(
    private messageService: MessageService,
    private configService: ConfigService,
    @InjectBot() private bot: Telegraf<SceneContext>,
  ) {}

  /*
    async notify(pageJob: PageJob) {
      const user = pageJob.user

      await this.bot.telegram.sendMessage(user.id, await this.messageService.notifyTemplate(pageJob))
      this.logger.log(`@${user.username ?? user.id} notified`)
    }*/
}
