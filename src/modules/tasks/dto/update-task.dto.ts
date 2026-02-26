import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: TaskStatus;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @Length(2, 1024)
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ example: ['bug', 'resolved'], required: false })
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @Length(2, 255, { each: true })
  @IsOptional()
  readonly tags?: string[];
}
