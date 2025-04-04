import { Request, Response } from "express";
import Task, { Priority } from "../models/Task";
import { IUser } from "../types/authTypes";

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser
}

export const getTasks = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({ user: req.user?._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ 
      message: err instanceof Error ? err.message : 'Error fetching tasks' 
    });
  }
};

export const createTask = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { text, priority } = req.body;
    const task = new Task({
      text,
      priority,
      user: req.user?._id
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ 
      message: err instanceof Error ? err.message : 'Error creating task' 
    });
  }
};

export const deleteTask = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user?._id 
    });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Error deleting task' });
  }
};

export const deleteCompletedTasks = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    // First get the IDs of tasks that will be deleted
    const tasksToDelete = await Task.find({ 
      user: req.user?._id,
      completed: true 
    }).select('_id');

    if (tasksToDelete.length === 0) {
      res.status(404).json({ message: 'No completed tasks found' });
      return;
    }

    const deletedIds = tasksToDelete.map(task => task._id);

    // Then delete the tasks
    const result = await Task.deleteMany({ 
      user: req.user?._id,
      completed: true 
    });

    res.json({ 
      message: `Successfully deleted ${result.deletedCount} completed tasks`,
      deletedIds: deletedIds
    });
  } catch (err) {
    res.status(500).json({ 
      message: err instanceof Error ? err.message : 'Error deleting completed tasks' 
    });
  }
};

export const updateTaskText = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      { $set: {
        text: req.body.text
      } },
      { new: true }
    );
    console.log(req.body.text);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Error updating task' });
  }
};

export const toggleImportant = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user?._id });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    task.important = !task.important;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Error toggling important' });
  }
};

export const toggleCompleted = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user?._id });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Error toggling completed' });
  }
};

export const togglePriority = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user?._id });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    switch (task.priority) {
      case Priority.LOW:
        task.priority = Priority.MEDIUM;
        break;
      case Priority.MEDIUM:
        task.priority = Priority.HIGH;
        break;
      case Priority.HIGH:
        task.priority = Priority.LOW;
        break;
      default:
        task.priority = Priority.MEDIUM;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Error toggling priority' });
  }
};