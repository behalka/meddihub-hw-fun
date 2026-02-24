import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetProjectsService } from '../services/get-projects.service';
import { CreateProjectsService } from '../services/create-projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';

@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectsControllerV1 {
  constructor(
    private readonly getProjectsService: GetProjectsService,
    private readonly projectsService: CreateProjectsService,
  ) {}

  @Get('')
  public async list(): Promise<Array<unknown>> {
    // todo: will build pagination
    return this.getProjectsService.fetch();
  }

  @Post('')
  public async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<unknown> {
    return this.projectsService.create(createProjectDto);
  }
}
