import { create } from 'zustand';
import { Task } from '../types/task';
import { taskService } from '../services/taskService';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, '_id' | 'createdAt'>) => Promise<void>;
  editTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  moveTask: (id: string, quadrant: Task['quadrant']) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.fetchTasks();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const filteredTasks = tasks.filter(task => {
        if (!task.completed) return true;
        const taskDate = new Date(task.createdAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });

      set({ tasks: filteredTasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskService.createTask(taskData);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  editTask: async (id, updates) => {
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === id ? { ...task, ...updates } : task
      ),
    }));

    try {
      const updatedTask = await taskService.updateTask(id, updates);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      set({ 
        tasks: previousTasks,
        error: (error as Error).message 
      });
    }
  },

  deleteTask: async (id) => {
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    }));

    try {
      await taskService.deleteTask(id);
    } catch (error) {
      set({ 
        tasks: previousTasks,
        error: (error as Error).message 
      });
    }
  },

  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t._id === id);
    if (!task) return;
    
    try {
      await get().editTask(id, { completed: !task.completed });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  moveTask: async (id, quadrant) => {
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === id ? { ...task, quadrant } : task
      ),
    }));

    try {
      await taskService.updateTask(id, { quadrant });
    } catch (error) {
      set({ 
        tasks: previousTasks,
        error: (error as Error).message 
      });
    }
  },
}));