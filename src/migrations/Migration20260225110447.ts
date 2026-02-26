import { Migration } from '@mikro-orm/migrations';

export class Migration20260225110447 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tag" alter column "id" drop default;`);
    this.addSql(`alter table "tag" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "tag" alter column "id" set default gen_random_uuid();`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tag" alter column "id" drop default;`);
    this.addSql(`alter table "tag" alter column "id" drop default;`);
    this.addSql(`alter table "tag" alter column "id" type uuid using ("id"::text::uuid);`);
  }

}
