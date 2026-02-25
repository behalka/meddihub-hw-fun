import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task, TaskStatus } from '../entities/task.entity';

import mikroOrmConfig from '../../../mikro-orm.config';
import { CreateTasksService } from '../services/create-tasks.service';
import { MikroORM } from '@mikro-orm/postgresql';

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
        MikroOrmModule.forFeature([Task]),
      ],
      providers: [CreateTasksService],
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
    it('should create a task in DB', async () => {
      const dto = {
        description: 'test description',
        status: TaskStatus.IN_PROGRESS,
      };
      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(result).toMatchObject(dto);

      // if we want to use the service EM in tests, we have to fork it
      // test the item is persisted in the DB
      const howMany = await orm.em.fork().count(Task);
      expect(howMany).toBe(1);
    });

    it('should create a task in DB with default status', async () => {
      const dto = { description: 'test description' };
      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(result.status).toBe(TaskStatus.NEW);
      expect(result.description).toBe(dto.description);

      const savedTask = await orm.em.fork().findOne(Task, { id: result.id });
      expect(savedTask?.status).toBe(TaskStatus.NEW);
    });
  });
});
