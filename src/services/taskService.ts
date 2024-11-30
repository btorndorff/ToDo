import { API_ENDPOINTS } from '../config/api';
import { Task } from '../types/task';

export interface CreateTaskDTO {
  title: string;
  completed: boolean;
  quadrant: Task['quadrant'];
}

export interface UpdateTaskDTO {
  title?: string;
  completed?: boolean;
  quadrant?: Task['quadrant'];
}

export const taskService = {
  async fetchTasks(): Promise<Task[]> {
    const response = await fetch(API_ENDPOINTS.TASKS);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async createTask(task: CreateTaskDTO): Promise<Task> {
    const response = await fetch(API_ENDPOINTS.TASKS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async updateTask(id: string, updates: UpdateTaskDTO): Promise<Task> {
    if (!id) {
      throw new Error('Task ID is required for update');
    }
    
    const response = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update task: ${error}`);
    }
    
    return response.json();
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },

  async parseTasks(text: string): Promise<Task[]> {
    const response = await fetch(`${API_ENDPOINTS.TASKS}/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to parse tasks: ${error}`);
    }
    
    return response.json();
  },
};