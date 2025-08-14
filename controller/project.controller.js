import Project from "../model/project.model.js";
import Epic from "../model/epic.model.js";
import Story from "../model/story.model.js";
import Task from "../model/task.model.js";
export const createProject = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const newProject = new Project({
      title,
      description,
      date,
      user: req.user.id,
    });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el proyecto", error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener proyectos", error: error.message });
  }
};

export const getProject = (req, res) => {
  res.json(req.project);
};

export const updateProject = async (req, res) => {
  try {
    Object.assign(req.project, req.body);
    const updatedProject = await req.project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el proyecto",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.project._id;

    //obtener todos los epics del proyecto
    const epics = await Epic.find({ project: projectId });
    const epicIds = epics.map((epic) => epic._id);
    //obtener todas las stories de esos epics
    const stories = await Story.find({ epic: { $in: epicIds } });
    const storyIds = stories.map((story) => story._id);
    //eliminar todas las tasks de esas stories
    const deletedTasks = await Task.deleteMany({ story: { $in: storyIds } });
    //eliminar todas las stories de esos epics
    const deletedStories = await Story.deleteMany({ epic: { $in: epicIds } });
    //eliminar todos los epics del proyecto
    const deletedEpics = await Epic.deleteMany({ project: projectId });
    //eliminar el proyecto
    await req.project.deleteOne();
    res.json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el proyecto", error: error.message });
  }
};
