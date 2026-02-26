import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task, TaskStatus } from '../entities/task.entity';
import { v4 } from 'uuid';

import mikroOrmConfig from '../../../mikro-orm.config';
import { UpdateTasksService } from '../services/update-tasks.service';
import { MikroORM } from '@mikro-orm/postgresql';
import { Tag } from '../entities/tag.entity';
import { TagsService } from '../services/tags.service';
import { Project } from '../../projects/entities/project.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateTasksService', () => {
  let module: TestingModule;
  let service: UpdateTasksService;
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
          allowGlobalContext: true,
        }),
        MikroOrmModule.forFeature([Task, Tag]),
      ],
      providers: [UpdateTasksService, TagsService],
    }).compile();

    service = module.get(UpdateTasksService);
  });

  beforeEach(async () => {
    await orm.schema.clearDatabase();
  });

  afterAll(async () => {
    await module.close();
    await orm.close();
  });

  describe('.update', () => {
    it('should throw an exception when task does not exist', async () => {
      const taskId = v4();
      const dto = { description: 'updated description' };
      await expect(service.update(taskId, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    describe('with existing task', () => {
      let taskId: string;
      const taskProps: Partial<Task> = {
        description: 'original description',
        status: TaskStatus.NEW,
      };

      beforeEach(async () => {
        const em = orm.em.fork();
        const project = em.create(Project, {
          name: 'test project',
          description: 'test description',
        });
        const task = em.create(Task, {
          ...taskProps,
          project: project,
        });

        await em.persist([project, task]).flush();
        taskId = task.id;
      });

      it('should update task description', async () => {
        const dto = { description: 'updated description' };
        const result = await service.update(taskId, dto);
        expect(result).toMatchObject({
          ...taskProps,
          ...dto,
        });
      });

      it('should update task status', async () => {
        const dto = { status: TaskStatus.DONE };
        const result = await service.update(taskId, dto);
        expect(result).toMatchObject({
          ...taskProps,
          ...dto,
        });
      });

      it('should update both description and status', async () => {
        const dto = {
          description: 'updated description',
          status: TaskStatus.IN_PROGRESS,
        };
        const result = await service.update(taskId, dto);
        expect(result).toMatchObject({
          ...taskProps,
          ...dto,
        });
      });
    });

    describe('with tags', () => {
      let taskId: string;

      beforeEach(async () => {
        const em = orm.em.fork();
        const project = em.create(Project, {
          name: 'test project',
          description: 'test description',
        });
        const tag1 = em.create(Tag, { name: 'tag1' });
        const task = em.create(Task, {
          description: 'task with tags',
          project: project,
        });
        task.tags.add(tag1);

        await em.persist([project, tag1, task]).flush();
        taskId = task.id;
      });

      it('should replace existing tags with new tags', async () => {
        const dto = { tags: ['tag2', 'tag3'] };
        const result = await service.update(taskId, dto);
        const tags = result.tags.getItems();
        expect(tags).toHaveLength(2);
        expect(tags.map((t) => t.name)).toContain('tag2');
        expect(tags.map((t) => t.name)).toContain('tag3');
        expect(tags.map((t) => t.name)).not.toContain('tag1');
      });

      it('should clear all tags when tags array is empty', async () => {
        const dto = { tags: [] };
        const result = await service.update(taskId, dto);
        expect(result.tags.getItems()).toHaveLength(0);
      });

      it('should not change tags if tags property is missing in DTO', async () => {
        const dto = { description: 'just description' };
        const result = await service.update(taskId, dto);
        const tags = result.tags.getItems();
        expect(tags).toHaveLength(1);
        expect(tags[0].name).toBe('tag1');
      });

      it('should reuse existing tag when adding it to task', async () => {
        const em = orm.em.fork();
        const tag2 = em.create(Tag, { name: 'tag2' });
        await em.persist(tag2).flush();

        const dto = { tags: ['tag1', 'tag2'] };
        const result = await service.update(taskId, dto);
        const tags = result.tags.getItems();
        expect(tags).toHaveLength(2);
        expect(tags.map((t) => t.name)).toContain('tag1');
        expect(tags.map((t) => t.name)).toContain('tag2');
      });
    });
  });
});
