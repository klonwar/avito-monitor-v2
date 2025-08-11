import { Page } from 'puppeteer'

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
    const page = this.taskService.getPage(link.id)

    if (!page) {
      this.logger.error(`No page found with id ${link.id}`)
      return false
    }

    const response = await page.goto(link.url)

    const isCaptcha = await page.$(`[class*="firewall-container"]`)

    if (isCaptcha) {
      this.logger.warn(`Captcha detected`)
      return false
    }

    if (!response || !response.ok()) return false

    const needToEnableLocalPriority = !!(await page.$(
      `[data-marker="filters/localPriority/localPriority"][aria-checked="false"]`,
    ))

    if (needToEnableLocalPriority) {
      const localPriorityEnabled = await this.enableLocalPriority(page)

      if (!localPriorityEnabled) {
        this.logger.warn(`Failed to enable local priority for link ${link.id}`)
        return false
      }
    }

    return true
  }

  private async enableLocalPriority(page: Page): Promise<boolean> {
    const location = await page.$(`[data-marker="search-form/change-location"]`)

    if (!location) return false

    await location.click()

    await page.waitForSelector('[class*="popup-localPriority"]')
    const checkbox = await page.$('[class*="popup-localPriority"]')

    await checkbox!.click()

    const button = await page.$(`[data-marker="popup-location/save-button"]`)

    if (!button) return false

    await button.click()

    await page.waitForNavigation()

    const localPriorityEnabled = await page.$(
      `[data-marker="filters/localPriority/localPriority"][aria-checked="true"]`,
    )

    return !!localPriorityEnabled
  }
}
