import { PuppeteerModule } from 'nestjs-puppeteer'
import stealth from 'puppeteer-extra-plugin-stealth'

import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import { BotModule } from '~/app/bot/bot.module'
import { LinkModule } from '~/entities/link/link.module'
import { TaskModule } from '~/entities/task/task.module'

import { ParserService } from './parser.service'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PuppeteerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        headless: configService.get<string>('HEADLESS') !== 'false',
        plugins: [stealth()],
      }),
    }),
    BotModule,
    LinkModule,
    TaskModule,
  ],
  providers: [ParserService],
  exports: [ParserService],
})
export class ParserModule {}
