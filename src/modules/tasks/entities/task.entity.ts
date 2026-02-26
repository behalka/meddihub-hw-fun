import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Project } from '../../projects/entities/project.entity';
import { Tag } from './tag.entity';

export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity()
export class Task {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property({ type: 'string' })
  status: TaskStatus = TaskStatus.NEW;

  @Property({ type: 'text' })
  description!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne({ entity: () => Project })
  project!: Project;

  @ManyToMany({ inversedBy: 'tasks', entity: () => Tag })
  tags = new Collection<Tag>(this);
}
