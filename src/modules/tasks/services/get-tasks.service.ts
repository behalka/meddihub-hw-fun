import { FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { GetTasksInputDto } from '../dto/get-tasks.input.dto';

@Injectable()
export class GetTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,
  ) {}

  public async fetch(input: GetTasksInputDto): Promise<Task[]> {
    const filter: FilterQuery<Task> = {};

    if (input.projectId) {
      filter.project = input.projectId;
    }

    if (input.description) {
      filter.description = { $ilike: `${input.description}%` };
    }

    if (input.tags) {
      filter.tags = { name: { $in: input.tags } };
    }

    return this.taskRepository.find(filter, { populate: ['tags', 'project'] });
  }
}
