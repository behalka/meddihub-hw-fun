import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class CreateProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: EntityRepository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
    });

    await this.projectRepository.getEntityManager().persist(project).flush();
    return project;
  }
}
