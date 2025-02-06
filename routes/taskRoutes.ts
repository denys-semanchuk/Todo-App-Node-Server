import express from "express";
import { protect } from "../middleware/protectMiddleware";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleImportant,
  toggleCompleted,
} from "../controllers/taskController";

const router = express.Router();

router.use(protect);

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.delete("/:id", protect, deleteTask);
router.put("/:id", protect, updateTask);
router.patch("/:id/important", protect, toggleImportant);
router.patch("/:id/completed", protect, toggleCompleted);

export default router;
