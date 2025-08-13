import Story from "../model/story.model.js";

function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

export const loadStory = async (req, res, next) => {
  try {
    const storyId = req.params.storyId || req.params.id;
    const { epicId, projectId } = req.params;

    if (!storyId) {
      console.log("Error: Falta storyId");
      return res.status(400).json({ message: "Falta id de story" });
    }

    if (!isValidObjectId(storyId)) {
      console.log("Error: ID de story inválido:", storyId);
      return res.status(400).json({ message: "ID de story inválido" });
    }

    console.log("Buscando story en DB...");
    const story = await Story.findById(storyId).populate({
      path: "epic",
      populate: { path: "project" },
    });

    if (!story) {
      console.log("Error: Story no encontrada en DB");
      return res.status(404).json({ message: "Story no encontrada" });
    }

    if (
      story.epic._id.toString() !== epicId ||
      story.epic.project._id.toString() !== projectId
    ) {
      console.log("Error: Story no pertenece a la épica/proyecto indicados");
      return res
        .status(400)
        .json({ message: "Story no pertenece a la épica/proyecto" });
    }

    if (story.epic.project.user.toString() !== req.user.id) {
      console.log("Error: Usuario no autorizado");
      return res.status(403).json({ message: "Acceso denegado a esta story" });
    }

    console.log("Story cargada correctamente, pasando al controlador");
    req.story = story;
    req.epic = story.epic;
    req.project = story.epic.project;
    next();
  } catch (error) {
    console.error("Error en loadStory:", error);
    res
      .status(500)
      .json({ message: "Error al cargar la story", error: error.message });
  }
};
