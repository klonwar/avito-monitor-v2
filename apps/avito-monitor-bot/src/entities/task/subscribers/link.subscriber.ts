import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent } from 'typeorm'

import { Injectable } from '@nestjs/common'

import { Link } from '~/entities/link/models/link.model'
import { TaskService } from '~/entities/task/task.service'

@EventSubscriber()
@Injectable()
export class LinkSubscriber implements EntitySubscriberInterface<Link> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly taskService: TaskService,
  ) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return Link
  }

  afterInsert(event: InsertEvent<Link>) {
    this.taskService.onLinkInsert(event.entity.id)
  }

  beforeRemove(event: RemoveEvent<Link>) {
    if (!event.entity) return

    this.taskService.onLinkRemove(event.entity.id)
  }
}
