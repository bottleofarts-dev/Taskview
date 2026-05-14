export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  dueDate?: string;
  hasReminder: boolean;
  priority: Priority;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
