import { TelegrafModule } from 'nestjs-telegraf'
import { session } from 'telegraf'
import TelegrafLogger from 'telegraf-logger'

import { Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { BotUpdate } from '~/app/bot/bot.update'
import { LinkModule } from '~/entities/link/link.module'
import { UserModule } from '~/entities/user/user.module'

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_TOKEN') ?? '',
        middlewares: [
          session(),
          (() => {
            const nestLogger = new Logger(TelegrafLogger.name)
            return new TelegrafLogger({
              log: (message) => nestLogger.verbose(message),
            }).middleware()
          })(),
        ],
      }),
    }),
    UserModule,
    LinkModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
