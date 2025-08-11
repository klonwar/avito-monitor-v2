import type { ICommand } from '@nestjs/cqrs'

import type { Link } from '~/entities/link/models/link.model'
import type { DiffResult } from '~/entities/task/features/diff/diff.types'

export class NotifyCommand implements ICommand {
  constructor(
    public readonly link: Link,
    public readonly diff: DiffResult,
  ) {}
}
