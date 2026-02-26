import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

@Entity()
export class Project {
  @ApiProperty({ example: '353e1a0b-193e-4b71-b258-450f69903e1a' })
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @ApiProperty({ example: 'My Awesome Project' })
  @Property()
  name!: string;

  @ApiProperty({ example: 'This project is about building something great' })
  @Property({ type: 'text' })
  description!: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @Property()
  createdAt = new Date();

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
