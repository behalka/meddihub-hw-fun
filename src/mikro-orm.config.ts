import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { appConfig } from './config/app-config';

export default defineConfig({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  host: 'localhost',
  port: appConfig.DB_PORT,
  user: appConfig.DB_USER,
  password: appConfig.DB_PASSWORD,
  dbName: appConfig.DB_NAME,
  debug: true,
});
