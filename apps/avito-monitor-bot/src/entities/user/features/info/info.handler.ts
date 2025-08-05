import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

import { InfoCommand } from '~/entities/user/features/info/info.command'
import { BotScene } from '~/shared/constants/bot.constants'

@CommandHandler(InfoCommand)
export class InfoHandler implements ICommandHandler<InfoCommand> {
  constructor() {}

  public async execute({ context }: InfoCommand): Promise<void> {
    await context.scene.enter(BotScene.INFO)
  }
}
