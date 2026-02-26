import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  public async upsertTags(tagNames: string[]): Promise<Tag[]> {
    if (isNil(tagNames) || tagNames.length === 0) {
      return [];
    }
    // sanitize tag names
    const sanitizedNames = tagNames.map((name) => name.toLowerCase());
    const tags = await Promise.all(
      sanitizedNames.map((name) => this.tagRepository.upsert({ name })),
    );

    return tags;
  }
}
