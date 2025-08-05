import { TelegrafModule } from 'nestjs-telegraf'
import { session } from 'telegraf'
import TelegrafLogger from 'telegraf-logger'

import { HttpModule } from '@nestjs/axios'
import { Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BotService } from './bot.service'
import { MessageService } from './message.service'

@Module({
  imports: [
    HttpModule,
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
    TypeOrmModule.forFeature([]),
  ],
  controllers: [],
  providers: [BotService, MessageService],
  exports: [BotService],
})
export class BotModule {}
