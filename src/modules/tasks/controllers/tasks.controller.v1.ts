import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GetTasksService } from '../services/get-tasks.service';
import { CreateTasksService } from '../services/create-tasks.service';
import { UpdateTasksService } from '../services/update-tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskIdParamDto } from '../dto/task-id-param.dto';
import { Task } from '../entities/task.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTasksInputDto } from '../dto/get-tasks.input.dto';
import { TasksPaginationOutputDto } from '../dto/tasks-pagination.output.dto';

@ApiTags('Tasks')
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
  @ApiOperation({ summary: 'List all tasks' })
  @ApiResponse({
    status: 200,
    description: 'Return pagination wrapper with tasks.',
    type: TasksPaginationOutputDto,
  })
  public async list(
    @Query() dto: GetTasksInputDto,
  ): Promise<TasksPaginationOutputDto> {
    return this.getTasksService.fetch(dto);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.createTasksService.create(createTaskDto);
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  public async update(
    @Param() { taskId }: TaskIdParamDto,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.updateTasksService.update(taskId, updateTaskDto);
  }
}
