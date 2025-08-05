import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import { Link } from '~/entities/link/models/link.model'

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: number

  @Column({
    nullable: true,
  })
  username?: string

  @OneToMany(() => Link, (link) => link.user, {
    eager: true,
  })
  links: Link[]
}
