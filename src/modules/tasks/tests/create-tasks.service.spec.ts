import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task, TaskStatus } from '../entities/task.entity';
import { v4 } from 'uuid';

import mikroOrmConfig from '../../../mikro-orm.config';
import { CreateTasksService } from '../services/create-tasks.service';
import { MikroORM } from '@mikro-orm/postgresql';
import { Tag } from '../entities/tag.entity';
import { TagsService } from '../services/tags.service';
import { Project } from '../../projects/entities/project.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateTasksService', () => {
  let module: TestingModule;
  let service: CreateTasksService;
  // service ORM instance to do cleanup between tests etc
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await MikroORM.init({
      ...mikroOrmConfig,
      allowGlobalContext: false,
    });

    module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          ...mikroOrmConfig,
          // this is a not-ideal workaround, will work as long as we run tests sequentially
          // @see: https://mikro-orm.io/docs/identity-map#global-identity-map
          allowGlobalContext: true,
        }),
        MikroOrmModule.forFeature([Task, Tag]),
      ],
      providers: [CreateTasksService, TagsService],
    }).compile();

    service = module.get(CreateTasksService);
  });

  beforeEach(async () => {
    // test data cleanup between runs
    await orm.schema.clearDatabase();
  });

  afterAll(async () => {
    await module.close();
    await orm.close();
  });

  describe('.create', () => {
    it('should throw an exception when projectId does not exist', async () => {
      const dto = {
        description: 'test description',
        status: TaskStatus.IN_PROGRESS,
        projectId: v4(),
      };
      await expect(service.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    describe('with existing project reference', () => {
      let projectId: string;

      beforeEach(async () => {
        const em = orm.em.fork();
        const project = em.create(Project, {
          name: 'test name',
          description: 'test description',
        });

        await em.persist(project).flush();
        projectId = project.id;
      });

      it('should create a task in DB with default status', async () => {
        const dto = { description: 'test description', projectId };
        const result = await service.create(dto);
        expect(result).toMatchObject({
          description: dto.description,
          status: TaskStatus.NEW,
        });
      });

      it('should create a task in DB with custom status', async () => {
        const dto = {
          status: TaskStatus.IN_PROGRESS,
          description: 'test description',
          projectId,
        };

        const result = await service.create(dto);
        expect(result).toMatchObject({
          description: dto.description,
          status: TaskStatus.IN_PROGRESS,
        });
      });
    });

    describe('with tags', () => {
      let projectId: string;
      let existingTag: Tag;

      beforeEach(async () => {
        const em = orm.em.fork();
        const project = em.create(Project, {
          name: 'test name',
          description: 'test description',
        });
        const existingTag = em.create(Tag, { name: 'existing' });

        await em.persist([project, existingTag]).flush();
        projectId = project.id;
      });

      it('should create a task and assign existing tag', async () => {
        const dto = {
          description: 'test description',
          projectId,
          tags: ['existing'],
        };
        const result = await service.create(dto);

        expect(result).toMatchObject({
          description: dto.description,
        });
        // tags is a mikro-orm collection object
        const tags = result.tags.getItems();
        expect(tags).toHaveLength(1);
        expect(tags[0]).toMatchObject({ name: 'existing' });
      });

      it('should create a task and a new tag', async () => {
        const dto = {
          description: 'test description',
          projectId,
          tags: ['new'],
        };
        const result = await service.create(dto);

        expect(result).toMatchObject({
          description: dto.description,
        });

        const tags = result.tags.getItems();
        expect(tags).toHaveLength(1);
        expect(tags[0]).toMatchObject({ name: 'new' });
      });

      it('should combine both old and new tags', async () => {
        const dto = {
          description: 'test description',
          projectId,
          tags: ['new', 'existing'],
        };
        const result = await service.create(dto);

        expect(result).toMatchObject({
          description: dto.description,
        });

        const tags = result.tags.getItems();
        expect(tags).toHaveLength(2);
      });
    });
  });
});
