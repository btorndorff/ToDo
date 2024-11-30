import mongoose from 'mongoose';

export interface ITask {
  title: string;
  completed: boolean;
  quadrant: 'important-urgent' | 'important-not-urgent' | 'not-important-urgent' | 'not-important-not-urgent';
  createdAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  quadrant: {
    type: String,
    required: true,
    enum: ['important-urgent', 'important-not-urgent', 'not-important-urgent', 'not-important-not-urgent'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Task = mongoose.model<ITask>('Task', taskSchema);