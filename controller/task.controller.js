import Task from "../model/task.model.js";

export const getTasks = async (req, res) => {
  try {

    const tasks = await Task.find({ story: req.story._id }).populate({
      path: "story",
      populate: {
        path: "epic",
        populate: {
          path: "project",
        },
      },
    });

    res.json(tasks);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error al obtener tareas", error: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.task._id).populate({
      path: "story",
      populate: {
        path: "epic",
        populate: {
          path: "project",
        },
      },
    });
    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la tarea", error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newTask = new Task({
      title,
      description,
      date: date || Date.now(),
      story: req.story._id,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la tarea", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    Object.assign(req.task, req.body);
    const updatedTask = await req.task.save();
    res.json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la tarea", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await req.task.deleteOne();
    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la tarea", error: error.message });
  }
};
