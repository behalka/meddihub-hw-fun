import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TasksControllerV1 } from './controllers/tasks.controller.v1';
import { CreateTasksService } from './services/create-tasks.service';
import { GetTasksService } from './services/get-tasks.service';
import { UpdateTasksService } from './services/update-tasks.service';
import { Task } from './entities/task.entity';
import { Tag } from './entities/tag.entity';
import { TagsService } from './services/tags.service';

@Module({
  imports: [MikroOrmModule.forFeature([Task, Tag])],
  controllers: [TasksControllerV1],
  providers: [
    CreateTasksService,
    GetTasksService,
    UpdateTasksService,
    TagsService,
  ],
  exports: [],
})
export class TasksModule {}
