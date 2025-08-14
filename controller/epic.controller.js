import Epic from "../model/epic.model.js";
import Story from "../model/story.model.js";
import Task from "../model/task.model.js";
export const createEpic = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newEpic = new Epic({
      title,
      description,
      date,
      project: req.project._id,
    });

    const savedEpic = await newEpic.save();

    res.status(201).json(savedEpic);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la epica", error: error.message });
  }
};

export const getEpics = async (req, res) => {
  try {
    const epics = await Epic.find({ project: req.project._id });
    res.json(epics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener epicas", error: error.message });
  }
};

export const getEpic = (req, res) => {
  if (!req.epic) {
    return res
      .status(404)
      .json({ message: "Épica no encontrada en controlador" });
  }

  res.json(req.epic);
};

export const updateEpic = async (req, res) => {
  try {
    Object.assign(req.epic, req.body);
    const updatedEpic = await req.epic.save();
    res.json(updatedEpic);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la epica", error: error.message });
  }
};

export const deleteEpic = async (req, res) => {
  try {
    const epicId = req.epic._id;

    //obtener todas las stories de este epic
    const stories = await Story.find({ epic: epicId });
    const storyIds = stories.map((story) => story._id);
    //eliminar todas las tasks de esas stories
    const deletedTasks = await Task.deleteMany({ story: { $in: storyIds } });
    //eliminar todas las stories de este epic
    const deletedStories = await Story.deleteMany({ epic: epicId });
    //eliminar el epic
    await req.epic.deleteOne();

    res.json({ message: "Épica y todo su contenido eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la epica", error: error.message });
  }
};
