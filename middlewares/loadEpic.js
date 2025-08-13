import mongoose from "mongoose";
import Epic from "../model/epic.model.js";

export const loadEpica = async (req, res, next) => {
  try {
    const epicId = req.params.id;
    const { projectId } = req.params;

    if (!epicId) {
      console.log("Error: Falta epicId");
      return res.status(400).json({ message: "Falta epicId" });
    }

    if (!mongoose.Types.ObjectId.isValid(epicId)) {
      console.log("Error: ID de épica inválido:", epicId);
      return res.status(400).json({ message: "ID de épica inválido" });
    }

    console.log("Buscando épica en DB...");
    const epic = await Epic.findById(epicId).populate("project");

    if (!epic) {
      console.log("Error: Épica no encontrada en DB");
      return res.status(404).json({ message: "Epica no encontrada" });
    }

    console.log("Épica encontrada:", epic.title);
    console.log("Proyecto de la épica:", epic.project._id.toString());
    console.log("Proyecto solicitado:", projectId);

    if (epic.project._id.toString() !== projectId) {
      console.log("Error: La épica no pertenece al proyecto");
      return res
        .status(400)
        .json({ message: "La épica no pertenece al proyecto indicado" });
    }

    if (epic.project.user.toString() !== req.user.id) {
      console.log("Error: Usuario no autorizado");
      return res.status(403).json({ message: "Acceso denegado a la epica" });
    }

    console.log("Middleware exitoso, pasando al controlador");
    req.epic = epic;
    req.project = epic.project;
    next();
  } catch (error) {
    console.error("Error en loadEpica:", error);
    res
      .status(500)
      .json({ message: "Error al cargar la epica", error: error.message });
  }
};
