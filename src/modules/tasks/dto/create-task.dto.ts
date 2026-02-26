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

export class CreateTaskDto {
  @ApiProperty({ enum: TaskStatus, example: TaskStatus.NEW, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: TaskStatus;

  @ApiProperty({ example: 'Fix the bug in the main component' })
  @IsString()
  @Length(2, 1024)
  readonly description!: string;

  @ApiProperty({ example: '353e1a0b-193e-4b71-b258-450f69903e1a' })
  @IsUUID()
  readonly projectId!: string;

  @ApiProperty({ example: ['bug', 'urgent'], required: false })
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @Length(2, 255, { each: true })
  @IsOptional()
  readonly tags?: string[];
}
