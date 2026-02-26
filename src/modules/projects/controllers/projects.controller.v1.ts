import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetProjectsService } from '../services/get-projects.service';
import { CreateProjectsService } from '../services/create-projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';

@ApiTags('Projects')
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
  @ApiOperation({ summary: 'List all projects' })
  @ApiResponse({
    status: 200,
    description: 'Return all projects.',
    type: Project,
    isArray: true,
  })
  public async list(): Promise<Array<Project>> {
    return this.getProjectsService.fetch();
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
    type: Project,
  })
  public async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectsService.create(createProjectDto);
  }
}
