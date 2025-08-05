import { MigrationInterface, QueryRunner } from 'typeorm'

export class Link1754386667173 implements MigrationInterface {
  name = 'Link1754386667173'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "link"
      (
        "id"     integer PRIMARY KEY NOT NULL,
        "url"    varchar             NOT NULL,
        "userId" integer
      )
    `)
    await queryRunner.query(`
      CREATE TABLE "temporary_link"
      (
        "id"     integer PRIMARY KEY NOT NULL,
        "url"    varchar             NOT NULL,
        "userId" integer,
        CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `)
    await queryRunner.query(`
      INSERT INTO "temporary_link"("id", "url", "userId")
      SELECT "id",
             "url",
             "userId"
      FROM "link"
    `)
    await queryRunner.query(`
      DROP TABLE "link"
    `)
    await queryRunner.query(`
      ALTER TABLE "temporary_link"
        RENAME TO "link"
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "link"
        RENAME TO "temporary_link"
    `)
    await queryRunner.query(`
      CREATE TABLE "link"
      (
        "id"     integer PRIMARY KEY NOT NULL,
        "url"    varchar             NOT NULL,
        "userId" integer
      )
    `)
    await queryRunner.query(`
      INSERT INTO "link"("id", "url", "userId")
      SELECT "id",
             "url",
             "userId"
      FROM "temporary_link"
    `)
    await queryRunner.query(`
      DROP TABLE "temporary_link"
    `)
    await queryRunner.query(`
      DROP TABLE "link"
    `)
  }
}
