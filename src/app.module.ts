import { Module, OnModuleInit } from '@nestjs/common';
import { ProjectsModule } from './modules/projects/projects.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import mikroOrmConfig from './mikro-orm.config';

@Module({
  imports: [
    // todo: change to config file so we can leverage the CLI generation
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      debug: true,
      // should be a default option
      registerRequestContext: true,
      extensions: [Migrator],
    }),
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.migrator.up();
  }
}
