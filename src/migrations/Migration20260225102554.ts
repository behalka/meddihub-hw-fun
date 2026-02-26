import { Migration } from '@mikro-orm/migrations';

export class Migration20260225102554 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tag" ("id" uuid not null, "name" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "tag_pkey" primary key ("id"));`);

    this.addSql(`create table "task_tags" ("task_id" uuid not null, "tag_id" uuid not null, constraint "task_tags_pkey" primary key ("task_id", "tag_id"));`);

    this.addSql(`alter table "task_tags" add constraint "task_tags_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "task_tags" add constraint "task_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "task" add column "project_id" uuid not null;`);
    this.addSql(`alter table "task" add constraint "task_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task_tags" drop constraint "task_tags_tag_id_foreign";`);

    this.addSql(`drop table if exists "tag" cascade;`);

    this.addSql(`drop table if exists "task_tags" cascade;`);

    this.addSql(`alter table "task" drop constraint "task_project_id_foreign";`);

    this.addSql(`alter table "task" drop column "project_id";`);
  }

}
