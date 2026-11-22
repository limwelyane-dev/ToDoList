
const mongoose = require("mongoose");
const Task = require("../models/Task");

const validPriorities = ["low", "medium", "high"];

const listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    if (title.trim().length > 150) {
      return res.status(400).json({
        message: "Title must be at most 150 characters.",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" ||
        description.length > 2000)
    ) {
      return res.status(400).json({
        message: "Description must be at most 2000 characters.",
      });
    }

    const taskPriority = priority || "medium";

    if (!validPriorities.includes(taskPriority)) {
      return res.status(400).json({
        message: "Priority must be low, medium, or high.",
      });
    }

    let parsedDueDate = null;

    if (dueDate !== undefined && dueDate !== null && dueDate !== "") {
      if (
        typeof dueDate !== "string" ||
        Number.isNaN(Date.parse(dueDate))
      ) {
        return res.status(400).json({
          message: "Invalid due date.",
        });
      }

      parsedDueDate = new Date(dueDate);
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      dueDate: parsedDueDate,
      priority: taskPriority,
      user: req.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid task ID.",
      });
    }

    const { title, description, completed, dueDate, priority } = req.body;

    const updates = {};

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 150
      ) {
        return res.status(400).json({
          message: "Title must be between 1 and 150 characters.",
        });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.length > 2000
      ) {
        return res.status(400).json({
          message: "Invalid task description.",
        });
      }

      updates.description = description.trim();
    }


    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be true or false.",
        });
      }

      updates.completed = completed;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === "") {
        updates.dueDate = null;
      } else if (
        typeof dueDate !== "string" ||
        Number.isNaN(Date.parse(dueDate))
      ) {
        return res.status(400).json({
          message: "Invalid due date.",
        });
      } else {
        updates.dueDate = new Date(dueDate);
      }
    }

    if (priority !== undefined) {
      if (
        typeof priority !== "string" ||
        !validPriorities.includes(priority)
      ) {
        return res.status(400).json({
          message: "Priority must be low, medium, or high.",
        });
      }

      updates.priority = priority;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
};
