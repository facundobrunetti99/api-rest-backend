import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { createTaskSchema } from "../schema/task.schema.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controller/task.controller.js";
import { loadProject } from "../middlewares/loadProject.js";
import { loadEpicForStories } from "../middlewares/loadEpicForStories.js";
import { loadStory } from "../middlewares/loadStory.js";
import { loadTask } from "../middlewares/loadTask.js";

const router = Router();

router.get(
  "/projects/:projectId/epics/:epicId/stories/:storyId/tasks",
  authRequired,
  loadProject,
  loadEpicForStories,
  loadStory,
  getTasks
);

router.post(
  "/projects/:projectId/epics/:epicId/stories/:storyId/task",
  authRequired,
  loadProject,
  loadEpicForStories,
  loadStory,
  validateSchema(createTaskSchema),
  createTask
);

router.get(
  "/projects/:projectId/epics/:epicId/stories/:storyId/task/:id",
  authRequired,
  loadProject,
  loadEpicForStories,
  loadStory,
  loadTask,
  getTask
);

router.put(
  "/projects/:projectId/epics/:epicId/stories/:storyId/task/:id",
  authRequired,
  loadProject,
  loadEpicForStories,
  loadStory,
  loadTask,
  updateTask
);

router.delete(
  "/projects/:projectId/epics/:epicId/stories/:storyId/task/:id",
  authRequired,
  loadProject,
  loadEpicForStories,
  loadStory,
  loadTask,
  deleteTask
);

export default router;
