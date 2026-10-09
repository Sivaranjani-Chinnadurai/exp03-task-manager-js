document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');
            
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <span class="task-text">${escapeHTML(task.text)}</span>
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
                <button class="delete-btn" data-id="${task.id}">×</button>
            `;
            taskList.appendChild(li);
        });
    }

    function addTask(e) {
        e.preventDefault();
        const text = taskInput.value.trim();
        const priority = prioritySelect.value;
        
        if (text !== '') {
            const newTask = {
                id: Date.now().toString(),
                text,
                priority,
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    function handleListClick(e) {
        if (e.target.classList.contains('task-checkbox')) {
            toggleTask(e.target.getAttribute('data-id'));
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(e.target.getAttribute('data-id'));
        }
    }

    function handleFilterClick(e) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    }

    // Utility to prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Event Listeners
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleListClick);
    filterBtns.forEach(btn => btn.addEventListener('click', handleFilterClick));

    // Initial render
    renderTasks();
});
