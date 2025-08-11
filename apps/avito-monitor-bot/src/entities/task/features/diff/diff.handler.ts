import { differenceBy } from 'lodash'

import { Logger } from '@nestjs/common'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

import { DiffCommand } from '~/entities/task/features/diff/diff.command'
import type { DiffResult } from '~/entities/task/features/diff/diff.types'
import { TaskService } from '~/entities/task/task.service'

@CommandHandler(DiffCommand)
export class DiffHandler implements ICommandHandler<DiffCommand> {
  private readonly logger = new Logger(DiffHandler.name)

  constructor(private readonly taskService: TaskService) {}

  public async execute({ link, newState }: DiffCommand): Promise<DiffResult> {
    if (!this.taskService.hasState(link.id)) {
      this.taskService.setState(link.id, newState)
    }

    const prevState = this.taskService.getState(link.id)!

    // todo detect removed
    // todo detect changed

    const newItems = differenceBy(newState, prevState, 'id')

    this.logger.log(
      `Compare prevState: ${prevState.length} and newState: ${newState.length}, found ${newItems.length} new items`,
    )

    this.taskService.setState(link.id, newState)

    return { newItems }
  }
}
