import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TagsService } from './tags.service';
import { Project } from '../../projects/entities/project.entity';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class UpdateTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * Service for updating a task. It is not possible to change projectId
   * in other words it is not possible to reassign task from a project to another one.
   *
   * @param taskId
   * @param updateTaskDto
   */
  async update(taskId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId, {
      populate: ['tags'],
    });

    if (isNil(task)) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    const { tags: tagNames, ...scalars } = updateTaskDto;

    wrap(task).assign({ ...scalars });

    if (!isNil(tagNames)) {
      const tags = await this.tagsService.upsertTags(tagNames);
      task.tags.set(tags);
    }

    await this.taskRepository.getEntityManager().flush();

    return task;
  }
}
