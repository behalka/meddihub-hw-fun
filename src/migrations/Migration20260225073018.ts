import { Migration } from '@mikro-orm/migrations';

export class Migration20260225073018 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "task" ("id" uuid not null, "status" varchar(255) not null default 'NEW', "description" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "task_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "task" cascade;`);
  }

}
