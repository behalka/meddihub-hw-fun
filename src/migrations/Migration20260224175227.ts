import { Migration } from '@mikro-orm/migrations';

export class Migration20260224175227 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "project" ("id" uuid not null, "name" varchar(255) not null, "description" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "project_pkey" primary key ("id"));`,
    );
  }
}
