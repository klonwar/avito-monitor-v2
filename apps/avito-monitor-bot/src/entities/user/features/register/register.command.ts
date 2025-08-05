import type { SceneContext } from 'telegraf/scenes'

import type { ICommand } from '@nestjs/cqrs'

export class RegisterCommand implements ICommand {
  constructor(public readonly context: SceneContext) {}
}
