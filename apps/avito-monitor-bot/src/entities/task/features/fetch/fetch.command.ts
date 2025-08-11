import type { ICommand } from '@nestjs/cqrs'

import type { Link } from '~/entities/link/models/link.model'

export class FetchCommand implements ICommand {
  constructor(public readonly link: Link) {}
}
