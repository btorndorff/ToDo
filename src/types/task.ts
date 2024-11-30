export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  quadrant: 'important-urgent' | 'important-not-urgent' | 'not-important-urgent' | 'not-important-not-urgent';
  createdAt: Date;
}