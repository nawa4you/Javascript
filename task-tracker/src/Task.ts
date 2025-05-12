// Define interfaces for Task data
export interface TaskData {
  title: string;
  completed?: boolean;
  createdAt?: Date | string;
  description?: string;
  category?: string; // Add this property
}

// Task class with TypeScript types
export default class Task {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  category: string; // Add this property

  constructor(title: string, description: string = '', category: string = 'General') {
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date();
    this.category = category; // Initialize the category
  }

  // Method with return type annotation
  toggleComplete(): void {
    this.completed = !this.completed;
  }

  // Static method with parameter and return type
  static fromObject(obj: TaskData): Task {
    const task = new Task(obj.title, obj.description || '', obj.category || 'General');

    if (obj.completed !== undefined) {
      task.completed = obj.completed;
    }

    if (obj.createdAt) {
      task.createdAt = new Date(obj.createdAt);
    }

    return task;
  }
}
