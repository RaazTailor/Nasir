class TaskManager {
    constructor() {
        this.taskForm = document.getElementById('taskForm');
        this.taskList = document.getElementById('taskList');
        this.taskFilter = document.getElementById('taskFilter');
        this.toast = document.getElementById('toast');

        this.bindEvents();
        this.loadTasks();
    }

    bindEvents() {
        this.taskForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.taskFilter.addEventListener('change', () => this.loadTasks());
    }

    showToast(title, message, type = 'success') {
        const toast = this.toast;
        toast.querySelector('.toast-title').textContent = title;
        toast.querySelector('.toast-message').textContent = message;
        toast.hidden = false;
        
        setTimeout(() => {
            toast.hidden = true;
        }, 3000);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const task = await api.createTask({
                title: formData.get('title'),
                category: formData.get('category'),
                date: formData.get('date')
            });

            this.showToast('Success', 'Task created successfully');
            this.loadTasks();
            e.target.reset();
        } catch (error) {
            this.showToast('Error', 'Failed to create task', 'error');
        }
    }

    async toggleTask(id, completed) {
        try {
            await api.updateTask(id, { completed });
            this.loadTasks();
        } catch (error) {
            this.showToast('Error', 'Failed to update task', 'error');
        }
    }

    async deleteTask(id) {
        try {
            await api.deleteTask(id);
            this.loadTasks();
            this.showToast('Success', 'Task deleted successfully');
        } catch (error) {
            this.showToast('Error', 'Failed to delete task', 'error');
        }
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    createTaskElement(task) {
        return `
            <div class="task-card">
                <div class="task-header">
                    <input type="checkbox" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="taskManager.toggleTask(${task.id}, this.checked)">
                    <div style="flex: 1">
                        <h3 class="task-title ${task.completed ? 'task-completed' : ''}">${task.title}</h3>
                        <div style="display: flex; gap: 0.5rem; align-items: center">
                            <span class="task-badge badge-${task.category}">${task.category}</span>
                            <span style="color: #6b7280; font-size: 0.875rem">
                                Due ${this.formatDate(task.date)}
                            </span>
                        </div>
                    </div>
                    <button onclick="taskManager.deleteTask(${task.id})" 
                            class="btn" 
                            style="color: #ef4444">Delete</button>
                </div>
            </div>
        `;
    }

    loadTasks() {
        const filter = this.taskFilter.value;
        let tasks = api.getTasks();

        if (filter !== 'all') {
            tasks = tasks.filter(task => {
                if (filter === 'completed') return task.completed;
                if (filter === 'incomplete') return !task.completed;
                return task.category === filter;
            });
        }

        this.taskList.innerHTML = tasks
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(task => this.createTaskElement(task))
            .join('');
    }
}

const taskManager = new TaskManager();
