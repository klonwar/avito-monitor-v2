import type { ICommand } from '@nestjs/cqrs'

import type { Link } from '~/entities/link/models/link.model'
import type { ParsedData } from '~/entities/task/features/parse/parse.types'

export class DiffCommand implements ICommand {
  constructor(
    public readonly link: Link,
    public readonly newState: ParsedData,
  ) {}
}
