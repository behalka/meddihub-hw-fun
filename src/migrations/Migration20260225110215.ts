import { Migration } from '@mikro-orm/migrations';

export class Migration20260225110215 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tag" add constraint "tag_name_unique" unique ("name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tag" drop constraint "tag_name_unique";`);
  }

}
