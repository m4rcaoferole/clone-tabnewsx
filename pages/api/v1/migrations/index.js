import controller from "infra/controller.js";
import database from "infra/database";
import { createRouter } from "next-connect";
import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";

const router = createRouter();

router.use(connectHandler);
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errrorHandlers);

let dbClient;
let defaultMigrationsOptions;

async function connectHandler(request, response, next) {
  dbClient = await database.getNewClient();
  defaultMigrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  await next();
  await dbClient?.end();
}

async function getHandler(request, response) {
  const pendingMigrations = await migrationsRunner(defaultMigrationsOptions);

  response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrationsRunner({
    ...defaultMigrationsOptions,
    dryRun: false,
  });

  if (migratedMigrations.length > 0) {
    response.status(201).json(migratedMigrations);
  }

  response.status(200).json(migratedMigrations);
}
