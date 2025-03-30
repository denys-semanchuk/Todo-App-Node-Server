var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Task, { Priority } from "../models/Task";
export const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tasks = yield Task.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({
            message: err instanceof Error ? err.message : 'Error fetching tasks'
        });
    }
});
export const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { text, priority } = req.body;
        const task = new Task({
            text,
            priority,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        const savedTask = yield task.save();
        res.status(201).json(savedTask);
    }
    catch (err) {
        res.status(400).json({
            message: err instanceof Error ? err.message : 'Error creating task'
        });
    }
});
export const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const task = yield Task.findOneAndDelete({
            _id: req.params.id,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : 'Error deleting task' });
    }
});
export const deleteCompletedTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // First get the IDs of tasks that will be deleted
        const tasksToDelete = yield Task.find({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            completed: true
        }).select('_id');
        if (tasksToDelete.length === 0) {
            res.status(404).json({ message: 'No completed tasks found' });
            return;
        }
        const deletedIds = tasksToDelete.map(task => task._id);
        // Then delete the tasks
        const result = yield Task.deleteMany({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            completed: true
        });
        res.json({
            message: `Successfully deleted ${result.deletedCount} completed tasks`,
            deletedIds: deletedIds
        });
    }
    catch (err) {
        res.status(500).json({
            message: err instanceof Error ? err.message : 'Error deleting completed tasks'
        });
    }
});
export const updateTaskText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const task = yield Task.findOneAndUpdate({ _id: req.params.id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { $set: {
                text: req.body.text
            } }, { new: true });
        console.log(req.body.text);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : 'Error updating task' });
    }
});
export const toggleImportant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const task = yield Task.findOne({ _id: req.params.id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        task.important = !task.important;
        yield task.save();
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : 'Error toggling important' });
    }
});
export const toggleCompleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const task = yield Task.findOne({ _id: req.params.id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        task.completed = !task.completed;
        yield task.save();
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : 'Error toggling completed' });
    }
});
export const togglePriority = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const task = yield Task.findOne({ _id: req.params.id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
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
        yield task.save();
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : 'Error toggling priority' });
    }
});
//# sourceMappingURL=taskController.js.map