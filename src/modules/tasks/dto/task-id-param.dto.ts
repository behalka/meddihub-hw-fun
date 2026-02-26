import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskIdParamDto {
  @ApiProperty({ example: '353e1a0b-193e-4b71-b258-450f69903e1a' })
  @IsUUID()
  readonly taskId!: string;
}
