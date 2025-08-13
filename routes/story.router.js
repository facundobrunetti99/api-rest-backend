import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { createStorySchema } from "../schema/story.schema.js";
import {
  getStory,
  getStories,
  updateStory,
  deleteStory,
  createStory,
} from "../controller/story.controller.js";
import { loadProject } from "../middlewares/loadProject.js";
import { loadEpicForStories } from "../middlewares/loadEpicForStories.js";
import { loadStory } from "../middlewares/loadStory.js";


const router = Router();

router.get(
  "/projects/:projectId/epics/:epicId/stories",
  authRequired,
  loadProject,
  loadEpicForStories,
  getStories
);

router.post(
  "/projects/:projectId/epics/:epicId/story",
  authRequired,
  loadProject,
  loadEpicForStories,
  validateSchema(createStorySchema),
  createStory
);

router.get(
  "/projects/:projectId/epics/:epicId/story/:id",
  authRequired,
  loadProject,
  loadEpicForStories,
  loadStory,
  getStory
);

router.put(
  "/projects/:projectId/epics/:epicId/story/:id",
  authRequired,
  loadProject,
  loadEpicForStories,
  loadStory,
  updateStory
);

router.delete(
  "/projects/:projectId/epics/:epicId/story/:id",
  authRequired,
  loadProject,
  loadEpicForStories,
  loadStory,
  deleteStory
);


export default router;
