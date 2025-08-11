import { InjectBrowser } from 'nestjs-puppeteer'
import type { Browser, Page } from 'puppeteer'
import { Repository } from 'typeorm'

import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Link } from '~/entities/link/models/link.model'
import type { ParsedData } from '~/entities/task/features/parse/parse.types'

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly logger = new Logger(TaskService.name)
  public readonly pages = new Map<number, Page>()
  public readonly states = new Map<number, ParsedData>()

  constructor(
    @InjectBrowser() private readonly browser: Browser,
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  async onModuleInit() {
    const links = await this.linkRepository.find()

    for (const link of links) {
      const page = await this.browser.newPage()
      this.pages.set(link.id, page)
    }
    this.logger.log(`Opened ${links.length} pages for existing links`)
  }

  async onLinkInsert(linkId: number): Promise<void> {
    if (this.pages.has(linkId)) {
      this.logger.warn(`Link with id ${linkId} already exists`)
      return
    }

    const page = await this.browser.newPage()
    this.pages.set(linkId, page)
    this.logger.log(`Page opened for link ${linkId}`)
  }

  async onLinkRemove(linkId: number): Promise<void> {
    const page = this.pages.get(linkId)
    if (page) {
      await page.close()
      this.pages.delete(linkId)
      this.logger.log(`Page closed for link ${linkId}`)
    }
    this.states.delete(linkId)
    this.logger.log(`States cleared for link ${linkId}`)
  }
}
