import type { SceneContext } from 'telegraf/scenes'

import type { ICommand } from '@nestjs/cqrs'

import { TelegramUser } from '~/shared/types/telegram.types'

export class ListLinksCommand implements ICommand {
  constructor(
    public readonly context: SceneContext,
    public readonly sender: TelegramUser,
  ) {}
}
