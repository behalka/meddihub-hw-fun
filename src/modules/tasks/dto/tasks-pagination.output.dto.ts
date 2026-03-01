import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class TasksPaginationOutputDto {
  @ApiProperty({
    description: 'Cursor to the next page. Base64 encoded.',
  })
  endCursor: string;

  @ApiProperty({ type: [Task], description: 'results' })
  items: Task[];

  @ApiProperty({ description: 'Total count of items' })
  totalCount: number;

  @ApiProperty({ description: 'Has next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Has previous page' })
  hasPrevPage: boolean;
}
