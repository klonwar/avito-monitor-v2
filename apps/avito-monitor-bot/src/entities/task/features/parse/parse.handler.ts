import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

import { ParseCommand } from '~/entities/task/features/parse/parse.command'
import type { ParsedData, ParsedItem } from '~/entities/task/features/parse/parse.types'
import { TaskService } from '~/entities/task/task.service'

@CommandHandler(ParseCommand)
export class ParseHandler implements ICommandHandler<ParseCommand> {
  constructor(private readonly taskService: TaskService) {}

  // todo refactor?
  public async execute({ link }: ParseCommand): Promise<ParsedData | null> {
    const page = this.taskService.pages.get(link.id)

    if (!page) {
      console.error(`No page found with id ${link.id}`)
      return null
    }

    const result: ParsedItem[] = []

    const elements = await page.$$('[data-marker="item"]')

    for (const element of elements) {
      const id = await element.evaluate((el) => el.getAttribute('data-item-id'))

      if (!id) continue

      const parsed: ParsedItem = {
        id,
        title: await element.evaluate((el) => el.querySelector('h2 [itemprop="url"]')?.getAttribute('title')),
        link: await element.evaluate((el) => el.querySelector('h2 [itemprop="url"]')?.getAttribute('href')),
        price: await element.evaluate((el) => el.querySelector('[itemprop="price"]')?.getAttribute('content')),
      }

      /*
       * @TODO: Check if needed
       *   description: await element.evaluate((el) =>
       *    el.querySelector('[itemprop="description"]')?.getAttribute('content'),
       *  ),
       * */

      result.push(parsed)
    }

    return result
  }
}
