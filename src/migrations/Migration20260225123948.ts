import { Migration } from '@mikro-orm/migrations';

export class Migration20260225123948 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tag" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "tag" alter column "created_at" set default now();`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tag" alter column "created_at" drop default;`);
    this.addSql(`alter table "tag" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
  }

}
