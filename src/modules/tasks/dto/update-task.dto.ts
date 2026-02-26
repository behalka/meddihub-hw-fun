import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: TaskStatus;

  @IsString()
  @Length(2, 1024)
  @IsOptional()
  readonly description?: string;

  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @Length(2, 255, { each: true })
  @IsOptional()
  readonly tags?: string[];
}
