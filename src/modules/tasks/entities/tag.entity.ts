import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { Task } from './task.entity';

@Entity()
export class Tag {
  @ApiProperty({ example: '353e1a0b-193e-4b71-b258-450f69903e1a' })
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id = v4();

  @ApiProperty({ example: 'feature' })
  @Property({ unique: true })
  name!: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @Property({ defaultRaw: 'now()', hidden: true })
  createdAt = new Date();

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @Property({ onUpdate: () => new Date(), defaultRaw: 'now()', hidden: true })
  updatedAt = new Date();

  @ManyToMany({ mappedBy: 'tags', entity: () => Task, hidden: true })
  tasks = new Collection<Task>(this);
}
