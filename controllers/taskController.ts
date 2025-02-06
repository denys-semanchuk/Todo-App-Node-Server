import { Response } from "express";
import { AuthenticatedRequest } from "../types/authTypes";
import Task, { Priority } from "../models/Task";

interface CreateTaskRequest {
  text: string;
  priority: Priority;
}

export const getTasks = async (
  req: AuthenticatedRequest,
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
  req: AuthenticatedRequest & { body: CreateTaskRequest },
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

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      { $set: req.body },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Error updating task' });
  }
};