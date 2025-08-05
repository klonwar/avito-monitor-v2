import { Repository } from 'typeorm'

import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import { ConfigureLinksCommand } from '~/entities/link/features/configure-links/configure-links.command'
import { ConfigureLinksKeyboard } from '~/entities/link/features/configure-links/configure-links.constants'
import { Link } from '~/entities/link/models/link.model'
import { User } from '~/entities/user/models/user.model'

@CommandHandler(ConfigureLinksCommand)
export class ConfigureLinksHandler implements ICommandHandler<ConfigureLinksCommand> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  public async execute({ context }: ConfigureLinksCommand): Promise<void> {
    await context.reply(`What do you want to do with your links?`, {
      reply_markup: {
        inline_keyboard: ConfigureLinksKeyboard,
      },
    })
  }
}
