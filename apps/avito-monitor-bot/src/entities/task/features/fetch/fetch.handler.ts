import { Logger } from '@nestjs/common'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

import { FetchCommand } from '~/entities/task/features/fetch/fetch.command'
import { TaskService } from '~/entities/task/task.service'

@CommandHandler(FetchCommand)
export class FetchHandler implements ICommandHandler<FetchCommand> {
  private readonly logger = new Logger(FetchHandler.name)

  constructor(private readonly taskService: TaskService) {}

  public async execute({ link }: FetchCommand): Promise<boolean> {
    const page = this.taskService.pages.get(link.id)

    if (!page) {
      this.logger.error(`No page found with id ${link.id}`)
      return false
    }

    const response = await page.goto(link.url)

    return !!response && response.ok()
  }
}
