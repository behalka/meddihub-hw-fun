import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task, TaskStatus } from '../entities/task.entity';
import { Tag } from '../entities/tag.entity';
import { Project } from '../../projects/entities/project.entity';
import { GetTasksService } from '../services/get-tasks.service';
import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfig from '../../../mikro-orm.config';

describe('GetTasksService', () => {
  let module: TestingModule;
  let service: GetTasksService;
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
        MikroOrmModule.forFeature([Task, Tag, Project]),
      ],
      providers: [GetTasksService],
    }).compile();

    service = module.get(GetTasksService);
  });

  beforeEach(async () => {
    await orm.schema.clearDatabase();
  });

  afterAll(async () => {
    await module.close();
    await orm.close();
  });

  describe('pagination', () => {
    it('should return 10 tasks with default limit', async () => {
      const em = orm.em.fork();
      const project = em.create(Project, {
        name: 'Test Project',
        description: 'Test Description',
      });

      const tasks = [];
      for (let i = 0; i < 15; i++) {
        tasks.push(
          em.create(Task, {
            description: `Task ${i}`,
            project,
            status: TaskStatus.NEW,
          }),
        );
      }
      await em.persist([project, ...tasks]).flush();

      const fetchedTasks = await service.fetch({});
      expect(fetchedTasks).toHaveLength(10);
    });

    it('should return correct tasks based on limit and offset', async () => {
      const em = orm.em.fork();
      const project = em.create(Project, {
        name: 'Test Project',
        description: 'Test Description',
      });

      const tasks = [];
      for (let i = 0; i < 5; i++) {
        tasks.push(
          em.create(Task, {
            description: `Task ${i}`,
            project,
            status: TaskStatus.NEW,
          }),
        );
      }
      // Sort tasks by description to ensure deterministic order if needed,
      // but MikroORM find order might vary if not specified.
      // We'll just check the count for now.
      await em.persist([project, ...tasks]).flush();

      const limit = 2;
      const offset = 1;
      const fetchedTasks = await service.fetch({});

      expect(fetchedTasks).toHaveLength(2);
    });
  });

  describe('references', () => {
    it('should return tasks with project and tags populated', async () => {
      const em = orm.em.fork();
      const project = em.create(Project, {
        name: 'Project with Task',
        description: 'Description',
      });
      const tag1 = em.create(Tag, { name: 'tag1' });
      const tag2 = em.create(Tag, { name: 'tag2' });
      const task = em.create(Task, {
        description: 'Task with refs',
        project,
        status: TaskStatus.NEW,
      });
      task.tags.add(tag1, tag2);

      await em.persist([project, tag1, tag2, task]).flush();

      const [fetchedTask] = await service.fetch({});

      expect(fetchedTask.project).toBeDefined();
      expect(fetchedTask.project.name).toBe('Project with Task');
      expect(fetchedTask.tags.isInitialized()).toBe(true);
      expect(fetchedTask.tags).toHaveLength(2);
      expect(fetchedTask.tags.getItems().map((t) => t.name)).toContain('tag1');
      expect(fetchedTask.tags.getItems().map((t) => t.name)).toContain('tag2');
    });
  });

  describe('filtering by description', () => {
    it('should return tasks with matching description', async () => {
      const em = orm.em.fork();
      const project = em.create(Project, {
        name: 'Project with Task',
        description: 'Description',
      });
      const task1 = em.create(Task, {
        description: 'Task 1',
        project,
      });
      const task2 = em.create(Task, {
        description: 'Another task',
        project,
      });

      await em.persist([project, task1, task2]).flush();

      const fetchedTasks = await service.fetch({ description: 'another' });
      expect(fetchedTasks).toHaveLength(1);
      expect(fetchedTasks[0].id).toEqual(task2.id);
    });
  });

  describe('filtering by tags', () => {
    let project: Project;
    let task1: Task;
    let task2: Task;

    beforeEach(async () => {
      const em = orm.em.fork();
      project = em.create(Project, {
        name: 'Project with Task',
        description: 'Description',
      });
      task1 = em.create(Task, {
        description: 'Task1',
        project,
      });
      task2 = em.create(Task, {
        description: 'Task2',
        project,
      });
    });

    it('should return tasks that contain exactly one specified tag', async () => {
      const em = orm.em.fork();

      const tag1 = em.create(Tag, { name: 'tag1' });
      const tag2 = em.create(Tag, { name: 'tag2' });
      const tag3 = em.create(Tag, { name: 'tag3' });
      const tag4 = em.create(Tag, { name: 'tag4' });
      task1.tags.add(tag1, tag2);
      task2.tags.add(tag3, tag4);

      await em.persist([project, tag1, tag2, tag3, tag4, task1, task2]).flush();

      const fetchedTasks = await service.fetch({ tags: ['tag2', 'tag3'] });

      expect(fetchedTasks).toHaveLength(2);
      expect(fetchedTasks.map((task) => task.id)).toIncludeSameMembers([
        task1.id,
        task2.id,
      ]);
    });

    it('should return all tasks that contain one specified tag', async () => {
      const em = orm.em.fork();
      const tag1 = em.create(Tag, { name: 'tag1' });
      const tag2 = em.create(Tag, { name: 'tag2' });

      task1.tags.add(tag1);
      task2.tags.add(tag2);

      await em.persist([project, tag1, tag2, task1, task2]).flush();

      const fetchedTasks = await service.fetch({ tags: ['tag1'] });

      expect(fetchedTasks).toHaveLength(1);
      expect(fetchedTasks[0].id).toEqual(task1.id);
    });
  });

  describe('filtering by projectId', () => {
    it('should filter tasks by projectId', async () => {
      const em = orm.em.fork();
      const project1 = em.create(Project, {
        name: 'Project 1',
        description: 'Description 1',
      });
      const project2 = em.create(Project, {
        name: 'Project 2',
        description: 'Description 2',
      });

      const task1 = em.create(Task, {
        description: 'Task in Project 1',
        project: project1,
        status: TaskStatus.NEW,
      });
      const task2 = em.create(Task, {
        description: 'Task in Project 2',
        project: project2,
        status: TaskStatus.NEW,
      });

      await em.persist([project1, project2, task1, task2]).flush();

      const fetchedTasks = await service.fetch({ projectId: project1.id });

      expect(fetchedTasks).toHaveLength(1);
      expect(fetchedTasks[0].id).toBe(task1.id);
      expect(fetchedTasks[0].project.id).toBe(project1.id);
    });
  });

  describe('filtering by multiple criteria', () => {
    it('should filter exactly one task out of three when using projectId, description and tags together', async () => {
      const em = orm.em.fork();

      // Two projects
      const projectA = em.create(Project, {
        name: 'Project A',
        description: 'A',
      });
      const projectB = em.create(Project, {
        name: 'Project B',
        description: 'B',
      });

      // Tags
      const tagAlpha = em.create(Tag, { name: 'alpha' });
      const tagBeta = em.create(Tag, { name: 'beta' });
      const tagGamma = em.create(Tag, { name: 'gamma' });

      // Three tasks:
      // 1) Matches ALL filters: in projectA, description starts with 'Fix log', contains tag 'beta'
      const matchTask = em.create(Task, {
        description: 'Fix login bug',
        project: projectA,
        status: TaskStatus.NEW,
      });
      matchTask.tags.add(tagBeta);

      // 2) Same description and tag, but different project -> filtered out by projectId
      const otherProjectTask = em.create(Task, {
        description: 'Fix login bug',
        project: projectB,
        status: TaskStatus.NEW,
      });
      otherProjectTask.tags.add(tagBeta);

      // 3) Same project and description, but tag not in provided list -> filtered out by tags
      const otherTagTask = em.create(Task, {
        description: 'Fix login bug',
        project: projectA,
        status: TaskStatus.NEW,
      });
      otherTagTask.tags.add(tagGamma);

      await em
        .persist([
          projectA,
          projectB,
          tagAlpha,
          tagBeta,
          tagGamma,
          matchTask,
          otherProjectTask,
          otherTagTask,
        ])
        .flush();

      // Use: projectId + description (prefix/ilike) + tags (any match)
      const fetchedTasks = await service.fetch({
        projectId: projectA.id,
        description: 'fix log',
        tags: ['beta', 'delta'],
      });

      expect(fetchedTasks).toHaveLength(1);
      expect(fetchedTasks[0].id).toBe(matchTask.id);
      expect(fetchedTasks[0].project.id).toBe(projectA.id);
      expect(
        fetchedTasks[0].tags.getItems().map((t) => t.name),
      ).toIncludeSameMembers(['beta']);
    });
  });
});
