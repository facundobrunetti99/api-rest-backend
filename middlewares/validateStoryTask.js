import StoryModel from "../model/story.model.js";

export const loadSt = async (req, res, next) => {
  try {
    const storyId = req.body.story;
    if (!storyId) {
      return res.status(400).json({ message: "Falta el ID de la historia" });
    }

    const story = await StoryModel.findById(storyId).populate({
      path: "epic",
      populate: {
        path: "project",
        populate: "user",
      },
    });

    if (!story) {
      return res.status(404).json({ message: "Historia no encontrada" });
    }

    const ownerId = story.epic?.project?.user?._id?.toString();

    if (!ownerId || ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes acceso a esta historia" });
    }

    req.story = story;
    req.epic = story.epic;
    req.project = story.epic.project;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cargar la historia", error: error.message });
  }
};
