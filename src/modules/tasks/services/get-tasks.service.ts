import { FilterQuery, FindByCursorOptions } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { GetTasksInputDto } from '../dto/get-tasks.input.dto';
import { TasksPaginationOutputDto } from '../dto/tasks-pagination.output.dto';
import { validate as validateUuid } from 'uuid';

@Injectable()
export class GetTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,
  ) {}

  /**
   * Retrieve information from cursor string
   * @param cursor base64-decoded string
   * @returns valid uuid
   * @private
   */
  private parseCursor(cursor: string): string {
    let idArray: unknown;
    try {
      idArray = JSON.parse(cursor);
    } catch {
      throw new BadRequestException(
        'Invalid cursor string provided - invalid json',
      );
    }

    if (
      Array.isArray(idArray) &&
      idArray.length === 1 &&
      validateUuid(idArray[0])
    ) {
      return idArray[0] as string;
    }

    throw new BadRequestException('Invalid cursor string provided');
  }

  public async fetch(
    input: GetTasksInputDto,
  ): Promise<TasksPaginationOutputDto> {
    const filter: FilterQuery<Task> = {};
    const paginationSettings: Pick<
      FindByCursorOptions<Task>,
      'first' | 'after'
    > = {
      first: input.limit ?? 10,
      after: input.nextCursor
        ? { id: this.parseCursor(input.nextCursor) }
        : null,
    };

    if (input.projectId) {
      filter.project = input.projectId;
    }

    if (input.description) {
      filter.description = { $ilike: `${input.description}%` };
    }

    if (input.tags) {
      filter.tags = { name: { $in: input.tags } };
    }

    const responseWithCursor = await this.taskRepository.findByCursor(filter, {
      first: paginationSettings.first,
      after: paginationSettings.after,
      orderBy: { id: 'desc' },
      includeCount: true,
      populate: ['tags', 'project'],
    });

    return {
      endCursor: responseWithCursor.endCursor,
      items: responseWithCursor.items,
      totalCount: responseWithCursor.totalCount,
      hasNextPage: responseWithCursor.hasNextPage,
      hasPrevPage: responseWithCursor.hasPrevPage,
    };
  }
}
