// Change require to import statements
import chalk from 'chalk';
import inquirer from 'inquirer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Task from './Task.js';

// Get current file's directory (workaround for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data.json');


// Path to our data file
const DATA_FILE = path.join(__dirname, '../data.json');
// Task list to store our tasks
let tasks = [];
// Function to load tasks from file
async function loadTasks() {
 try {
 // Check if file exists
 await fs.access(DATA_FILE);





 // Read and parse the file
 const data = await fs.readFile(DATA_FILE, 'utf8');
 tasks = JSON.parse(data);
 console.log(chalk.green('Tasks loaded successfully!'));
 } catch (error) {
 // If file doesn't exist, create empty tasks array
 if (error.code === 'ENOENT') {
 tasks = [];
 } else {
 console.error(chalk.red('Error loading tasks:'), error);
 }
 }
}
// Function to save tasks to file
async function saveTasks() {
 try {
 // Create directory if it doesn't exist
 const dir = path.dirname(DATA_FILE);
 await fs.mkdir(dir, { recursive: true }).catch(() => {});
 
 // Write tasks to file
 await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
 console.log(chalk.green('Tasks saved successfully!'));
 } catch (error) {
 console.error(chalk.red('Error saving tasks:'), error);
 }
}
// Start the application
async function main() {
 console.log(chalk.blue('=== Task Tracker ==='));
 
 // Load existing tasks
 await loadTasks();
 
 // Show main menu
 await showMainMenu();
}
// Show the main menu
async function showMainMenu() {
 while (true) {
 const { action } = await inquirer.prompt([
 {
 type: 'list',
 name: 'action',
 message: 'What would you like to do?',
 choices: [
 { name: 'View Tasks', value: 'view' },
 { name: 'Add Task', value: 'add' },
 { name: 'Complete Task', value: 'complete' },
 { name: 'Delete Task', value: 'delete' },
 { name: 'Search Tasks', value: 'search' },
 { name: 'Exit', value: 'exit' }
 ]
 }
 ]);
 
 if (action === 'exit') {
 console.log(chalk.blue('Goodbye!'));
 break;
 }
 
 // Execute the selected action
 if (action === 'view') await viewTasks();
 if (action === 'add') await addTask();
 if (action === 'complete') await completeTask();
 if (action === 'delete') await deleteTask();
 }
}
// Function to view tasks
async function viewTasks() {
 console.log(chalk.blue('\n=== Your Tasks ==='));
 
 if (tasks.length === 0) {
 console.log(chalk.yellow('No tasks found.'));
 return;
 }
 
 // Display tasks
 tasks.forEach((task, index) => {
 const status = task.completed ? chalk.green('✓') : chalk.yellow('○');
 const title = task.completed ? chalk.dim(task.title) :
chalk.white(task.title);
 console.log(`${index + 1}. ${status} ${title}`);
 });
 
 console.log(''); // Empty line for spacing
}
// Function to add a task
async function addTask() {
 const { title } = await inquirer.prompt([
 {
 type: 'input',
 name: 'title',
 message: 'Enter task title:',
 validate: input => input.trim() ? true : 'Title is required'
 }
 ]);
 
 // Create a new task object
 const task = {
 title: title.trim(),
 completed: false,
 createdAt: new Date()






 };
 
 // Add to tasks array
 tasks.push(task);
 
 // Save tasks
 await saveTasks();
 
 console.log(chalk.green(`Task "${title}" added successfully!`));
}
// Function to complete a task
async function completeTask() {
 if (tasks.length === 0) {
 console.log(chalk.yellow('No tasks to complete!'));
 return;
 }
 
 // Show tasks for selection
 await viewTasks();
 
 const { taskIndex } = await inquirer.prompt([
 {
 type: 'number',
 name: 'taskIndex',
 message: 'Enter task number to mark as complete:',
 validate: input => {
 const index = Number(input) - 1;
 return (index >= 0 && index < tasks.length) 
 ? true
 : 'Please enter a valid task number';
 }
 }
 ]);
 
 // Convert to 0-based index
 const index = taskIndex - 1;
 
 // Toggle completion status
 tasks[index].completed = !tasks[index].completed;
 
 // Save tasks
 await saveTasks();
 
 const status = tasks[index].completed ? 'completed' : 'incomplete';
 console.log(chalk.green(`Task marked as ${status}!`));
}
// Function to delete a task
async function deleteTask() {
 if (tasks.length === 0) {
 console.log(chalk.yellow('No tasks to delete!'));
 return;
 }






 // Show tasks for selection
 await viewTasks();
 
 const { taskIndex } = await inquirer.prompt([
 {
 type: 'number',
 name: 'taskIndex',
 message: 'Enter task number to delete:',
 validate: input => {
 const index = Number(input) - 1;
 return (index >= 0 && index < tasks.length) 
 ? true
 : 'Please enter a valid task number';
 }
 }
 ]);
 
 const index = taskIndex - 1;
 const taskTitle = tasks[index].title;
 
 // Confirm deletion
 const { confirm } = await inquirer.prompt([
 {
 type: 'confirm',
 name: 'confirm',
 message: `Are you sure you want to delete task "${taskTitle}"?`,
 default: false
 }
 ]);
 
 if (!confirm) {
 console.log(chalk.yellow('Deletion cancelled.'));
 return;
 }
 
 // Remove task from array
 tasks.splice(index, 1);
 
 // Save tasks
 await saveTasks();
 
 console.log(chalk.green(`Task "${taskTitle}" deleted successfully!`));
}
// Start the application
main().catch(error => {
 console.error(chalk.red('An error occurred:'), error);
});



// Change require to import statements
import chalk from 'chalk';
import inquirer from 'inquirer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Get current file's directory (workaround for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Task class using ES6 class syntax
export default class Task {
 constructor(title) {
 this.title = title;
 this.completed = false;
 this.createdAt = new Date();
 }
 
 // Method to toggle completion status
 toggleComplete() {
 this.completed = !this.completed;
 return this;
 }
 
 // Static method to create task from plain object
 static fromObject(obj) {
 const task = new Task(obj.title);
 task.completed = obj.completed;
 task.createdAt = new Date(obj.createdAt);
 return task;
 }
}