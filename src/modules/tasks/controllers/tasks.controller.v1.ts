import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GetTasksService } from '../services/get-tasks.service';
import { CreateTasksService } from '../services/create-tasks.service';
import { UpdateTasksService } from '../services/update-tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskIdParamDto } from '../dto/task-id-param.dto';
import { Task } from '../entities/task.entity';

@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksControllerV1 {
  constructor(
    private readonly getTasksService: GetTasksService,
    private readonly createTasksService: CreateTasksService,
    private readonly updateTasksService: UpdateTasksService,
  ) {}

  @Get('')
  public async list(): Promise<Array<Task>> {
    return this.getTasksService.fetch();
  }

  @Post('')
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.createTasksService.create(createTaskDto);
  }

  @Patch(':taskId')
  public async update(
    @Param() { taskId }: TaskIdParamDto,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.updateTasksService.update(taskId, updateTaskDto);
  }
}
