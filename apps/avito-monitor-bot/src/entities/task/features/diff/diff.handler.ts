import { differenceBy } from 'lodash'

import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

import { DiffCommand } from '~/entities/task/features/diff/diff.command'
import type { DiffResult } from '~/entities/task/features/diff/diff.types'
import { TaskService } from '~/entities/task/task.service'

@CommandHandler(DiffCommand)
export class DiffHandler implements ICommandHandler<DiffCommand> {
  constructor(private readonly taskService: TaskService) {}

  public async execute({ link, newState }: DiffCommand): Promise<DiffResult> {
    if (!this.taskService.states.has(link.id)) {
      this.taskService.states.set(link.id, newState)
    }

    const prevState = this.taskService.states.get(link.id)!

    // todo detect removed
    // todo detect changed

    // todo invent seenIds if duplicates

    const newItems = differenceBy(newState, prevState, 'id')

    this.taskService.states.set(link.id, newState)

    return { newItems }
  }
}
