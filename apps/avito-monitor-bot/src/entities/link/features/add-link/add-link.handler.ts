import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

import { AddLinkCommand } from '~/entities/link/features/add-link/add-link.command'
import { BotScene } from '~/shared/constants/bot.constants'

@CommandHandler(AddLinkCommand)
export class AddLinkHandler implements ICommandHandler<AddLinkCommand> {
  constructor() {}

  public async execute({ context }: AddLinkCommand): Promise<void> {
    await context.scene.enter(BotScene.ADD_LINK)
  }
}
