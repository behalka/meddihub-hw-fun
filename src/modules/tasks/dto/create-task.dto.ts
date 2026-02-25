import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: TaskStatus;

  @IsString()
  @IsOptional()
  @Length(2, 1024)
  readonly description?: string;
}
