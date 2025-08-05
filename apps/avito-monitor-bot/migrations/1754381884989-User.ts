import { MigrationInterface, QueryRunner } from 'typeorm'

export class User1754381884989 implements MigrationInterface {
  name = 'User1754381884989'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY NOT NULL,
                "username" varchar
            )
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user"
        `)
  }
}
