import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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

  // pagination settings
  @IsOptional()
  @IsString()
  @Length(2, 1024)
  @Transform(({ value }) => Buffer.from(value, 'base64').toString('utf8'))
  @ApiProperty({
    description: 'Next taskId we are looking for - base64 encoded',
    example: 'WyI1YzY1MmViMy03Zjc2LTRiNGYtOTBhOS05OGMzZDBjMTQxZmUiXQ',
    required: false,
  })
  nextCursor?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiProperty({
    description: 'Pagination limit',
    example: 10,
    required: false,
  })
  limit?: number;
}
