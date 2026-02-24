import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Project {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property()
  name!: string;

  @Property({ type: 'text' })
  description!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
