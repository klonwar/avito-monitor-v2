import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'

import { User } from '~/entities/user/models/user.model'

@Entity()
export class Link extends BaseEntity {
  @PrimaryColumn()
  id: number

  @Column()
  url: string

  @ManyToOne(() => User, (user) => user.links)
  user: User
}
