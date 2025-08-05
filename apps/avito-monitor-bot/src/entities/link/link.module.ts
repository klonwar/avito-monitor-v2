import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AddLinkHandler } from '~/entities/link/features/add-link/add-link.handler'
import { AddLinkScene } from '~/entities/link/features/add-link/add-link.scene'
import { ConfigureLinksHandler } from '~/entities/link/features/configure-links/configure-links.handler'
import { ListLinksHandler } from '~/entities/link/features/list-links/list-links.handler'
import { RemoveLinkHandler } from '~/entities/link/features/remove-link/remove-link.handler'
import { RemoveLinkScene } from '~/entities/link/features/remove-link/remove-link.scene'
import { Link } from '~/entities/link/models/link.model'
import { User } from '~/entities/user/models/user.model'

@Module({
  imports: [TypeOrmModule.forFeature([User, Link])],
  providers: [
    ListLinksHandler,
    ConfigureLinksHandler,
    AddLinkHandler,
    RemoveLinkHandler,
    AddLinkScene,
    RemoveLinkScene,
  ],
  exports: [TypeOrmModule.forFeature([Link])],
})
export class LinkModule {}
