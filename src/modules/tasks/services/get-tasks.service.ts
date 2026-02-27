import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class GetTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,
  ) {}

  public async fetch(): Promise<Task[]> {
    return this.taskRepository.find({}, { populate: ['tags', 'project'] });
  }
}
