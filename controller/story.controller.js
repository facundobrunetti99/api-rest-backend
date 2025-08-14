import Story from "../model/story.model.js";
import Task from "../model/task.model.js";
export const createStory = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newStory = new Story({
      title,
      description,
      date,
      epic: req.epic._id,
    });

    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la story", error: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ epic: req.epic._id }).populate({
      path: "epic",
      populate: {
        path: "project",
      },
    });
    res.json(stories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener stories", error: error.message });
  }
};

export const getStory = async (req, res) => {
  try {
    // También agregamos populate para getStory individual
    const story = await Story.findById(req.story._id).populate({
      path: "epic",
      populate: {
        path: "project",
      },
    });
    res.json(story);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la story", error: error.message });
  }
};

export const updateStory = async (req, res) => {
  try {
    Object.assign(req.story, req.body);
    const updatedStory = await req.story.save();
    res.json(updatedStory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la story", error: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const storyId = req.story._id;
    //eliminar todas las tasks de esta story
    await Task.deleteMany({ story: storyId });
    //eliminar la story
    await req.story.deleteOne();
    res.json({
      message: "Story y todas sus tareas asociadas eliminadas correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la story",
      error: error.message,
    });
  }
};
