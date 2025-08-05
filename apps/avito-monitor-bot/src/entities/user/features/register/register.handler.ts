import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

import { RegisterCommand } from '~/entities/user/features/register/register.command'
import { BotScene } from '~/shared/constants/bot.constants'

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor() {}

  public async execute({ context }: RegisterCommand): Promise<void> {
    await context.scene.enter(BotScene.REGISTRATION)
  }
}
