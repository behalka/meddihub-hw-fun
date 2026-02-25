import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Project } from '../entities/project.entity';

import mikroOrmConfig from '../../../mikro-orm.config';
import { CreateProjectsService } from '../services/create-projects.service';
import { MikroORM } from '@mikro-orm/postgresql';

describe('CreateProjectsService', () => {
  let module: TestingModule;
  let service: CreateProjectsService;
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
        MikroOrmModule.forFeature([Project]),
      ],
      providers: [CreateProjectsService],
    }).compile();

    service = module.get(CreateProjectsService);
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
    it('should create a project in DB', async () => {
      const dto = { name: 'test', description: 'test' };
      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(result).toMatchObject(dto);

      // if we want to use the service EM in tests, we have to fork it
      // test the item is persisted in the DB
      const howMany = await orm.em.fork().count(Project);
      expect(howMany).toBe(1);
    });
  });
});
