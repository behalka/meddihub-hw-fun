import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTasksInputDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Project id - where the task belongs to',
    example: '353e1a0b-193e-4b71-b258-450f69903e1a',
    required: false,
  })
  projectId?: string;

  @ApiProperty({ example: ['bug', 'resolved'], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @Length(2, 255, { each: true })
  tags?: string[];

  @IsOptional()
  @ApiProperty({ example: 'My task details', required: false })
  @IsString()
  @Length(2, 1024)
  description?: string;
}
