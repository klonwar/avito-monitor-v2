import * as path from 'path'
import { DataSource } from 'typeorm'

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  // CLI commands will execute in ts context, using ".ts" files from "src" dir
  // NestJS in runtime will use ".js" files from "dist" dir
  entities: [path.join(__dirname, `**`, `*.model.{ts,js}`)],
  migrations: [path.join(__dirname, `migrations`, `**`, `*.{ts,js}`)],
  migrationsTableName: `migrations_typeorm`,
  synchronize: false,
  migrationsRun: true,
  logging: true,
  logger: `file`,
})

export default AppDataSource

/**
 * Migration CLI usage:
 *  - `npm run mg:schema` to check if migration can be generated
 *  - `npm run mg:generate ./migrations/MigrationName` to generate based on schema changes
 *  - `npm run mg:run` to apply migrations
 *  - `npm run mg:revert` to rollback migrations
 *  - `npm rum mg:create ./migrations/MigrationName` to create empty migration
 * */
