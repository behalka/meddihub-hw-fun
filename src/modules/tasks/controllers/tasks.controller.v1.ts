import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetTasksService } from '../services/get-tasks.service';
import { CreateTasksService } from '../services/create-tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';

@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksControllerV1 {
  constructor(
    private readonly getTasksService: GetTasksService,
    private readonly tasksService: CreateTasksService,
  ) {}

  @Get('')
  public async list(): Promise<Array<unknown>> {
    return this.getTasksService.fetch();
  }

  @Post('')
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<unknown> {
    return this.tasksService.create(createTaskDto);
  }
}
