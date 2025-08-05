import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

import { AddLinkCommand } from '~/entities/link/features/add-link/add-link.command'
import { RemoveLinkCommand } from '~/entities/link/features/remove-link/remove-link.command'
import { BotScene } from '~/shared/constants/bot.constants'

@CommandHandler(RemoveLinkCommand)
export class RemoveLinkHandler implements ICommandHandler<RemoveLinkCommand> {
  constructor() {}

  public async execute({ context }: AddLinkCommand): Promise<void> {
    await context.scene.enter(BotScene.REMOVE_LINK)
  }
}
