import mongoose, { Schema } from 'mongoose';

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

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