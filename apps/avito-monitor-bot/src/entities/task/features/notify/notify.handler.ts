import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { SceneContext } from 'telegraf/scenes'
import { Repository } from 'typeorm'

import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import { Link } from '~/entities/link/models/link.model'
import { NotifyCommand } from '~/entities/task/features/notify/notify.command'
import { User } from '~/entities/user/models/user.model'

@CommandHandler(NotifyCommand)
export class NotifyHandler implements ICommandHandler<NotifyCommand> {
  constructor(
    @InjectBot() private bot: Telegraf<SceneContext>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  public async execute({ link: { id: linkId }, diff }: NotifyCommand): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
      relations: ['user'],
    })
    const { id: userId } = link?.user || {}

    // @TODO: Better message formatting
    if (userId) {
      diff.newItems.forEach((newItem) => {
        this.bot.telegram.sendMessage(
          userId,
          `❗ New item found!\n\n` + `[Link](https://www.avito.ru${newItem.link})`,
          {
            parse_mode: 'Markdown',
          },
        )
      })
    }
  }
}
