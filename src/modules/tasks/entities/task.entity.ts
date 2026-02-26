import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: '353e1a0b-193e-4b71-b258-450f69903e1a' })
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.NEW })
  @Property({ type: 'string' })
  status: TaskStatus = TaskStatus.NEW;

  @ApiProperty({ example: 'Fix the bug in the main component' })
  @Property({ type: 'text' })
  description!: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @Property()
  createdAt = new Date();

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ApiProperty({ type: () => Project })
  @ManyToOne({ entity: () => Project })
  project!: Project;

  @ApiProperty({ type: () => Tag, isArray: true })
  @ManyToMany({ inversedBy: 'tasks', entity: () => Tag })
  tags = new Collection<Tag>(this);
}
