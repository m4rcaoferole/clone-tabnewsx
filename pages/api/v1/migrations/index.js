import controller from "infra/controller.js";
import migrator from "models/migrator.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errrorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await migrator.ListPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    response.status(201).json(migratedMigrations);
  }
  response.status(200).json(migratedMigrations);
}
