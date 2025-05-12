// Task class with TypeScript types
export default class Task {
    constructor(title, description = '', category = 'General') {
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = new Date();
        this.category = category; // Initialize the category
    }
    // Method with return type annotation
    toggleComplete() {
        this.completed = !this.completed;
    }
    // Static method with parameter and return type
    static fromObject(obj) {
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
