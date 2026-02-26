import { IsUUID } from 'class-validator';

export class TaskIdParamDto {
  @IsUUID()
  readonly taskId!: string;
}
