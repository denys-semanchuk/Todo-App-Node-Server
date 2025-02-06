import { Request, Response } from "express";
import Task from "../models/Task";
import { IUser } from "../types/authTypes";

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser // or any other type
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

export const updateTask = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
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