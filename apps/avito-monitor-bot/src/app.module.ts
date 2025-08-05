import AppDataSource from 'ormconfig'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BotModule } from './bot/bot.module'
import { User } from './model/user/user.model'
import { AppUpdate } from './app.update'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User]),
    BotModule,
  ],
  providers: [AppUpdate],
})
export class AppModule {}
