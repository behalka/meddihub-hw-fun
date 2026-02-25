import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TasksControllerV1 } from './controllers/tasks.controller.v1';
import { CreateTasksService } from './services/create-tasks.service';
import { GetTasksService } from './services/get-tasks.service';
import { Task } from './entities/task.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Task])],
  controllers: [TasksControllerV1],
  providers: [CreateTasksService, GetTasksService],
  exports: [],
})
export class TasksModule {}
