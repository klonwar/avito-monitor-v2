import { Repository } from 'typeorm'

import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import { ListLinksCommand } from '~/entities/link/features/list-links/list-links.command'
import { Link } from '~/entities/link/models/link.model'
import { User } from '~/entities/user/models/user.model'

@CommandHandler(ListLinksCommand)
export class ListLinksHandler implements ICommandHandler<ListLinksCommand> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  public async execute({ context, sender }: ListLinksCommand): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: sender.id })

    if (!user) return

    if (!user.links.length) {
      await context.reply(`You have 0 subscriptions`)
      return
    }

    await context.reply(
      'Your subscriptions:\n\n' +
        user.links
          .map(
            (link, index) =>
              `${index + 1}. [${link.url.replace('https://www.avito.ru', '').slice(0, 60)}...](${link.url})`,
          )
          .join('\n'),
      {
        parse_mode: 'Markdown',
      },
    )
  }
}
