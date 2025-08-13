import Epic from "../model/epic.model.js";

function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

export const loadEpicForStories = async (req, res, next) => {
  try {
    const epicId = req.params.epicId;
    const epicIdAlternative = req.params.id;
    const projectId = req.params.projectId;

    if (!epicId && !epicIdAlternative) {
      return res.status(400).json({
        message: "Falta epicId",
        debug: {
          params: req.params,
          url: req.originalUrl,
          availableKeys: Object.keys(req.params),
        },
      });
    }

    const finalEpicId = epicId || epicIdAlternative;
    //Epic ID FINAL A USAR

    if (!isValidObjectId(finalEpicId)) {
      //ERROR ID DE EPICA INVALIDO

      return res.status(400).json({ message: "ID de épica inválido" });
    }

    const epic = await Epic.findById(finalEpicId).populate("project"); //BUSCANDO EPICA BD

    if (!epic) {
      return res.status(404).json({ message: "Epica no encontrada" });
    }

    if (epic.project._id.toString() !== projectId) {
      //EPICA NO PERTENECE AL PROJECTO params
      return res
        .status(400)
        .json({ message: "La épica no pertenece al proyecto indicado" });
    }

    if (epic.project.user.toString() !== req.user.id) {
      //usuario no autorizado
      return res.status(403).json({ message: "Acceso denegado a la epica" });
    }

    req.epic = epic;
    req.project = epic.project;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cargar la epica", error: error.message });
  }
};
