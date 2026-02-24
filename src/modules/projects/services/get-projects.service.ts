import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Project } from '../entities/project.entity';

@Injectable()
export class GetProjectsService {
  constructor(private readonly em: EntityManager) {}

  public async fetch(): Promise<Project[]> {
    return this.em.find(Project, {});
  }
}
