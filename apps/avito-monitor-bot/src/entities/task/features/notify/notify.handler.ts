import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { SceneContext } from 'telegraf/scenes'
import { Repository } from 'typeorm'

import { Logger } from '@nestjs/common'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import { Link } from '~/entities/link/models/link.model'
import { NotifyCommand } from '~/entities/task/features/notify/notify.command'
import { TaskService } from '~/entities/task/task.service'
import { User } from '~/entities/user/models/user.model'

@CommandHandler(NotifyCommand)
export class NotifyHandler implements ICommandHandler<NotifyCommand> {
  private readonly logger = new Logger(NotifyHandler.name)

  constructor(
    @InjectBot() private bot: Telegraf<SceneContext>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
    private taskService: TaskService,
  ) {}

  public async execute({ link: { id: linkId }, diff }: NotifyCommand): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
      relations: ['user'],
    })
    const { id: userId } = link?.user || {}

    if (userId) {
      this.logger.log(`Notify about ${diff.newItems.length} new items`)
      diff.newItems
        .filter((item) => !this.taskService.isInSeenIds(linkId, item.id))
        .forEach((newItem) => {
          // @TODO: Better message formatting
          this.bot.telegram.sendMessage(
            userId,
            `❗ ${newItem.title}\n\n` + `💰 ${newItem.price}\n\n` + `[Link](https://www.avito.ru${newItem.link})`,
            {
              parse_mode: 'Markdown',
            },
          )
        })
    }
  }
}
