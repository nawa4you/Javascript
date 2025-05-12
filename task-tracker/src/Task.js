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




// Task list to store our tasks
let tasks = [];
// Load tasks from file
const loadTasks = async () => {
 try {
 // Check if file exists
 await fs.access(DATA_FILE);
 
 // Read and parse the file
 const data = await fs.readFile(DATA_FILE, 'utf8');





 // Convert plain objects to Task instances
 tasks = JSON.parse(data).map(obj => Task.fromObject(obj));
 
 console.log(chalk.green('Tasks loaded successfully!'));
 } catch (error) {
 // If file doesn't exist, create empty tasks array
 if (error.code === 'ENOENT') {
 tasks = [];
 } else {
 console.error(chalk.red('Error loading tasks:'), error);
 }
 }
};
// Save tasks to file
const saveTasks = async () => {
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
};
// View tasks
const viewTasks = () => {
 console.log(chalk.blue('\n=== Your Tasks ==='));
 
 if (tasks.length === 0) {
 console.log(chalk.yellow('No tasks found.'));
 return;
 }
 
 // Display tasks using template literals
 tasks.forEach((task, index) => {
 const status = task.completed ? chalk.green('✓') : chalk.yellow('○');
 const title = task.completed ? chalk.dim(task.title) :
chalk.white(task.title);
 
 // Format date using Intl API
 const date = new Intl.DateTimeFormat('en-US', {
 dateStyle: 'medium',
 timeStyle: 'short'
 }).format(task.createdAt);
 
 // Template literal for formatted output
 console.log(`${index + 1}. ${status} ${title} ${chalk.dim(`(created:
${date})`)}`);
 });



 console.log(''); // Empty line for spacing
};
// Add a task
const addTask = async () => {
 // Destructuring the result object
 const { title } = await inquirer.prompt([
 {
 type: 'input',
 name: 'title',
 message: 'Enter task title:',
 validate: input => input.trim() ? true : 'Title is required'
 }
 ]);
 
 // Create a new task using the class
 const task = new Task(title.trim());
 
 // Add to tasks array using spread operator
 tasks = [...tasks, task];
 
 // Save tasks
 await saveTasks();
 
 console.log(chalk.green(`Task "${title}" added successfully!`));
};
// Complete a task
const completeTask = async () => {
 if (tasks.length === 0) {
 console.log(chalk.yellow('No tasks to complete!'));
 return;
 }
 
 // Show tasks for selection
 viewTasks();
 
 const { taskIndex } = await inquirer.prompt([
 {
 type: 'number',
 name: 'taskIndex',
 message: 'Enter task number to toggle completion:',
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


 // Toggle completion status using class method
 tasks[index].toggleComplete();
 
 // Save tasks
 await saveTasks();
 
 const status = tasks[index].completed ? 'completed' : 'incomplete';
 console.log(chalk.green(`Task marked as ${status}!`));
};
// Delete a task
const deleteTask = async () => {
 if (tasks.length === 0) {
 console.log(chalk.yellow('No tasks to delete!'));
 return;
 }
 
 // Show tasks for selection
 viewTasks();
 
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
 
 // Remove task from array using filter


 tasks = tasks.filter((_, i) => i !== index);
 
 // Save tasks
 await saveTasks();
 
 console.log(chalk.green(`Task "${taskTitle}" deleted successfully!`));
};






// Search for a task by title or description
const searchTask = async () => {
  if (tasks.length === 0) {
    console.log(chalk.yellow('No tasks to search!'));
    return;
  }

  const { searchTerm } = await inquirer.prompt([
    {
      type: 'input',
      name: 'searchTerm',
      message: 'Enter a keyword to search for tasks:',
      validate: (input) => input.trim() ? true : 'Search term is required'
    }
  ]);

  const results = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (results.length === 0) {
    console.log(chalk.yellow('No tasks found matching your search.'));
  } else {
    console.log(chalk.blue('\n=== Search Results ==='));
    results.forEach((task, index) => {
      const status = task.completed ? chalk.green('✓') : chalk.yellow('○');
      const title = task.completed ? chalk.dim(task.title) : chalk.white(task.title);
      const date = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(task.createdAt);
      console.log(`${index + 1}. ${status} ${title} ${chalk.dim(`(created: ${date})`)}`);
    });
    console.log(''); // Empty line for spacing
  }
};






// Show the main menu
const showMainMenu = async () => {
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
 { name: 'Search Task', value: 'search' }, 
 { name: 'Exit', value: 'exit' }
 ]
 }
 ]);
 
 if (action === 'exit') {
 console.log(chalk.blue('Goodbye!'));
 break;
 }
 
 // Using object property shorthand and computed property names
 const actions = {
    view: viewTasks,
    add: addTask,
    complete: completeTask,
    delete: deleteTask,
    search: searchTask, // Add the searchTask function
    exit: async () => Promise.resolve()
 };
 
 await actions[action]();
 }
};
// Start the application using arrow function
const main = async () => {
 console.log(chalk.blue(`
============================
 Task Tracker
 ES6+ Demo Project
============================
 `));
 
 // Load existing tasks
 await loadTasks();

 // Show main menu
 await showMainMenu();
};
// Start the application
main().catch(error => {
 console.error(chalk.red('An error occurred:'), error);
});

