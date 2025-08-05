import type { SceneContext } from 'telegraf/scenes'

import type { ICommand } from '@nestjs/cqrs'

export class AddLinkCommand implements ICommand {
  constructor(public readonly context: SceneContext) {}
}
