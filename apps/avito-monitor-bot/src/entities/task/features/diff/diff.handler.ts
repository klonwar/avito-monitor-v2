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

    // Ensuring that new items are appearing at the top of the list
    const prevIds = new Set(prevState.map((i) => i.id))
    const anchorIndex = newState.findIndex((i) => prevIds.has(i.id))

    if (anchorIndex < 0) {
      this.logger.warn(`No matching items found for link ${link.id}, skipping diff`)
    }

    const headEnd = anchorIndex >= 0 ? anchorIndex : 0

    const headSlice = newState.slice(0, headEnd)

    const newItems = differenceBy(headSlice, prevState, 'id').filter(
      (item) => !this.taskService.hasSeen(link.id, item.id),
    )

    this.logger.log(
      `Compare prevState: ${prevState.length} and newState: ${newState.length}, headSlice: ${headSlice}, found ${newItems.length} new items`,
    )

    this.taskService.setState(link.id, newState)

    return { newItems }
  }
}
