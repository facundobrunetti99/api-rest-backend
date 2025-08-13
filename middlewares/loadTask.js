import Task from "../model/task.model.js";

export const loadTask = async (req, res, next) => {
  try {
    const taskId = req.params.id || req.body.task;
    if (!taskId){
        return res.status(400).json({ message: "Falta el ID de la tarea" });
    }

    

    const task = await Task.findById(taskId).populate({
      path: "story",
      populate: {
        path: "epic",
        populate: {
          path: "project",
          select: "user",
        },
      },
    });

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    const ownerId = task.story?.epic?.project?.user?.toString();

    if (!ownerId || ownerId !== req.user.id)
      return res.status(403).json({ message: "Acceso denegado a esta tarea" });

    req.task = task;
    req.story = task.story;
    req.epic = task.story.epic;
    req.project = task.story.epic.project;

    next();
  } catch (error) {
 
    res
      .status(500)
      .json({ message: "Error al cargar la tarea", error: error.message });
  }
};
