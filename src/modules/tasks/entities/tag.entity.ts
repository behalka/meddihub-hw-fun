import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Task } from './task.entity';

@Entity()
export class Tag {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id = v4();

  @Property({ unique: true })
  name!: string;

  @Property({ defaultRaw: 'now()' })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), defaultRaw: 'now()' })
  updatedAt = new Date();

  @ManyToMany({ mappedBy: 'tags', entity: () => Task })
  tasks = new Collection<Task>(this);
}
