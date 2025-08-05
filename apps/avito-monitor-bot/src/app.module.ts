import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BotModule } from './bot/bot.module'
import { AppUpdate } from './app.update'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([]),
    BotModule,
  ],
  providers: [AppUpdate],
})
export class AppModule {}
