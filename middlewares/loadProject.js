import Project from "../model/project.model.js";
import mongoose from "mongoose";

export const loadProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "ID de proyecto inválido" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (project.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No autorizado para acceder a este proyecto" });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error("Error en loadProject:", error);
    return res.status(500).json({ message: "Error al cargar el proyecto" });
  }
};
