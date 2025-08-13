import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { loadProject } from "../middlewares/loadProject.js";
import {
  getProject,
  getProjects,
  deleteProject,
  updateProject,
  createProject,
} from "../controller/project.controller.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { createProjectSchema } from "../schema/project.schema.js";

const router = Router();

router.get("/projects", authRequired, getProjects);
router.get("/project/:projectId", authRequired, loadProject, getProject);
router.post(
  "/project",
  authRequired,
  validateSchema(createProjectSchema),
  createProject
);
router.put("/project/:projectId", authRequired, loadProject, updateProject);
router.delete("/project/:projectId", authRequired, loadProject, deleteProject);

export default router;
