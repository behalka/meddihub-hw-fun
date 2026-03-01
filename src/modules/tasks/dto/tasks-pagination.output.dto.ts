import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class TasksPaginationOutputDto {
  @ApiProperty({
    description: 'Cursor to the next page. Base64 encoded.',
    type: String,
  })
  endCursor: string;

  @ApiProperty({ type: () => [Task], description: 'results' })
  items: Task[];

  @ApiProperty({ description: 'Total count of items', type: Number })
  totalCount: number;

  @ApiProperty({ description: 'Has next page', type: Boolean })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Has previous page', type: Boolean })
  hasPrevPage: boolean;
}
