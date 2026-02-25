import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';

@Injectable()
export class GetTasksService {
  constructor(private readonly em: EntityManager) {}

  public async fetch(): Promise<Task[]> {
    return this.em.find(Task, {});
  }
}
