import { CronJob } from 'cron'
import { Repository } from 'typeorm'

import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandBus } from '@nestjs/cqrs'
import { SchedulerRegistry } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'

import { Link } from '~/entities/link/models/link.model'
import { DiffCommand } from '~/entities/task/features/diff/diff.command'
import type { DiffResult } from '~/entities/task/features/diff/diff.types'
import { FetchCommand } from '~/entities/task/features/fetch/fetch.command'
import { NotifyCommand } from '~/entities/task/features/notify/notify.command'
import { ParseCommand } from '~/entities/task/features/parse/parse.command'
import type { ParsedData } from '~/entities/task/features/parse/parse.types'

@Injectable()
export class ParserService implements OnModuleInit {
  private readonly logger = new Logger(ParserService.name)

  constructor(
    protected readonly commandBus: CommandBus,
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  async onModuleInit() {
    const cronTime = this.configService.get<string>('CRON') ?? '0 * * * *'
    const cronJob = new CronJob(cronTime, () => this.tick())
    this.schedulerRegistry.addCronJob(`parser`, cronJob)
    cronJob.start()
    this.logger.log(`Parser job started: ${cronTime}`)
  }

  private async tick() {
    try {
      const links = await this.linkRepository.find()
      this.logger.log(`[Tick] Parse ${links.length} links`)

      for (const link of links) {
        // @TODO: Research option to create separate strategies for different link types (check with regexp?)
        //        avito, fresh, auto.ru, drom
        const fetched = await this.commandBus.execute(new FetchCommand(link))

        if (!fetched) {
          this.logger.warn(`[Tick] Failed to fetch link: ${link.id}`)
          continue
        }

        const parsedData = await this.commandBus.execute<ParseCommand, ParsedData | null>(new ParseCommand(link))

        if (!parsedData) {
          this.logger.warn(`[Tick] Failed to parse link: ${link.id}`)
          continue
        }

        const diff = await this.commandBus.execute<DiffCommand, DiffResult>(new DiffCommand(link, parsedData))

        if (diff.newItems.length) {
          await this.commandBus.execute(new NotifyCommand(link, diff))
        }

        // @TODO: Some delay?
      }

      this.logger.log(`[Tick] Completed`)
    } catch (e) {
      this.logger.error(`[Tick] Failed`)
      this.logger.error(e.stack)
    }
  }
}
