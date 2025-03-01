class TaskAPI {
    constructor() {
        this.STORAGE_KEY = 'alnasiru-tasks';
        this.currentId = this.getNextId();
    }

    getNextId() {
        const tasks = this.getTasks();
        return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    }

    getTasks() {
        const tasks = localStorage.getItem(this.STORAGE_KEY);
        return tasks ? JSON.parse(tasks) : [];
    }

    async createTask(task) {
        const tasks = this.getTasks();
        const newTask = {
            ...task,
            id: this.currentId++,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        return newTask;
    }

    async updateTask(id, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Task not found');
        
        tasks[index] = { ...tasks[index], ...updates };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        return tasks[index];
    }

    async deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(t => t.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTasks));
    }
}

const api = new TaskAPI();
