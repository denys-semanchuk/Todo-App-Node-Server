import mongoose, { Schema } from 'mongoose';
export var Priority;
(function (Priority) {
    Priority["HIGH"] = "HIGH";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["LOW"] = "LOW";
})(Priority || (Priority = {}));
const taskSchema = new Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    timestamp: { type: Number, default: Date.now },
    important: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: Object.values(Priority),
        default: Priority.MEDIUM
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
export default mongoose.model('Task', taskSchema);
//# sourceMappingURL=Task.js.map