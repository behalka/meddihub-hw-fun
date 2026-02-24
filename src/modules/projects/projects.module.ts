import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectsControllerV1 } from './controllers/projects.controller.v1';
import { CreateProjectsService } from './services/create-projects.service';
import { Project } from './entities/project.entity';
import { GetProjectsService } from './services/get-projects.service';

@Module({
  imports: [MikroOrmModule.forFeature([Project])],
  controllers: [ProjectsControllerV1],
  providers: [CreateProjectsService, GetProjectsService],
  exports: [],
})
export class ProjectsModule {}
