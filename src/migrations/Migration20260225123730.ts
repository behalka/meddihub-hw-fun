import { Migration } from '@mikro-orm/migrations';

export class Migration20260225123730 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tag" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "tag" alter column "updated_at" set default now();`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tag" alter column "updated_at" drop default;`);
    this.addSql(`alter table "tag" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
  }

}
