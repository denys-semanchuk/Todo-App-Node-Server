import express from "express";
import { protect } from "../middleware/protectMiddleware";
import { getTasks, createTask, deleteTask, updateTaskText, toggleImportant, toggleCompleted, togglePriority, deleteCompletedTasks, } from "../controllers/taskController";
const router = express.Router();
router.use(protect);
router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.delete('/completed-tasks', protect, deleteCompletedTasks);
router.delete("/:id", protect, deleteTask);
router.put("/:id", protect, updateTaskText);
router.patch("/:id/important", protect, toggleImportant);
router.patch("/:id/completed", protect, toggleCompleted);
router.patch("/:id/priority", protect, togglePriority);
export default router;
//# sourceMappingURL=taskRoutes.js.map