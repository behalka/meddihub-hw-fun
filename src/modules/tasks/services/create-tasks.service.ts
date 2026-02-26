import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TagsService } from './tags.service';
import { Project } from '../../projects/entities/project.entity';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class CreateTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,
    private readonly tagsService: TagsService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    await this.ensureProjectRef(createTaskDto.projectId);

    const tags = await this.tagsService.upsertTags(createTaskDto.tags);
    const task = this.taskRepository.create({
      ...createTaskDto,
      project: createTaskDto.projectId,
      tags,
    });

    this.taskRepository.getEntityManager().persist(task);
    await this.taskRepository.getEntityManager().flush();

    if (task.tags.isInitialized()) {
      await task.tags.init();
    }

    return task;
  }

  private async ensureProjectRef(projectId: string): Promise<void> {
    const project = await this.taskRepository
      .getEntityManager()
      .findOne(Project, { id: projectId });

    if (isNil(project)) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
  }
}
