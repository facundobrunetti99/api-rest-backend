import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { createEpicSchema } from "../schema/epic.schema.js";
import {
  createEpic,
  getEpic,
  getEpics,
  deleteEpic,
  updateEpic,
} from "../controller/epic.controller.js";
import { loadEpica } from "../middlewares/loadEpic.js";
import { loadProject } from "../middlewares/loadProject.js";

const router = Router();

router.get("/projects/:projectId/epics", authRequired, loadProject, getEpics);
router.post(
  "/projects/:projectId/epics",
  authRequired,
  loadProject,
  validateSchema(createEpicSchema),
  createEpic
);
router.get(
  "/projects/:projectId/epics/:id",
  authRequired,
  loadProject,
  loadEpica,
  getEpic
);
router.put(
  "/projects/:projectId/epics/:id",
  authRequired,
  loadProject,
  loadEpica,
  updateEpic
);
router.delete(
  "/projects/:projectId/epics/:id",
  authRequired,
  loadProject,
  loadEpica,
  deleteEpic
);

export default router;
