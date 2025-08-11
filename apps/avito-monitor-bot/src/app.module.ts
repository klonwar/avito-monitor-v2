import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BotModule } from '~/app/bot/bot.module'
import { ParserModule } from '~/app/parser/parser.module'

import AppDataSource from '../ormconfig'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
    }),

    CqrsModule.forRoot(),
    BotModule,
    ParserModule,
  ],
})
export class AppModule {}
