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
  private readonly pages = new Map<number, Page>()
  private readonly states = new Map<number, ParsedData>()
  private readonly seenIds = new Map<number, Set<string>>()

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
      this.seenIds.set(link.id, new Set())
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
    this.seenIds.set(linkId, new Set())
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
    this.seenIds.delete(linkId)
    this.logger.log(`States cleared for link ${linkId}`)
  }

  getPage(linkId: number): Page | undefined {
    const page = this.pages.get(linkId)
    if (!page) {
      this.logger.error(`No page found with id ${linkId}`)
    }
    return page
  }

  hasState(linkId: number): boolean {
    return this.states.has(linkId)
  }

  getState(linkId: number): ParsedData | undefined {
    const state = this.states.get(linkId)
    if (!state) {
      this.logger.error(`No state found with id ${linkId}`)
    }
    return state
  }

  setState(linkId: number, state: ParsedData): void {
    this.states.set(linkId, state)

    const seenIdsSet = this.seenIds.get(linkId)

    state.forEach((item) => {
      seenIdsSet?.add(item.id)
    })
  }

  hasSeen(linkId: number, itemId: string): boolean {
    const seenIdsSet = this.seenIds.get(linkId)
    if (!seenIdsSet) {
      this.logger.error(`No seenIds set found for link id ${linkId}`)
      return false
    }
    return seenIdsSet.has(itemId)
  }
}
