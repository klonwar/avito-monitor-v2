import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Link } from '~/entities/link/models/link.model'
import { DiffHandler } from '~/entities/task/features/diff/diff.handler'
import { FetchHandler } from '~/entities/task/features/fetch/fetch.handler'
import { NotifyHandler } from '~/entities/task/features/notify/notify.handler'
import { ParseHandler } from '~/entities/task/features/parse/parse.handler'
import { LinkSubscriber } from '~/entities/task/subscribers/link.subscriber'
import { TaskService } from '~/entities/task/task.service'
import { User } from '~/entities/user/models/user.model'

@Module({
  imports: [TypeOrmModule.forFeature([Link, User])],
  providers: [TaskService, FetchHandler, ParseHandler, DiffHandler, NotifyHandler, LinkSubscriber],
  exports: [],
})
export class TaskModule {}
