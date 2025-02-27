document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const darkModeToggle = document.getElementById('darkModeToggle');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Digital clock functionality
    function updateClock() {
        const now = new Date();
        const clockDisplay = document.getElementById('clockDisplay');
        const dateDisplay = document.getElementById('dateDisplay');
        
        const time = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        const date = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        clockDisplay.textContent = time;
        dateDisplay.textContent = date;
    }

    // Update clock every second
    setInterval(updateClock, 1000);
    updateClock(); // Initial call

    // Enhanced dark mode toggle with animation
    const toggleDarkMode = () => {
        const root = document.documentElement;
        root.classList.toggle('dark');
        
        // Animate transition
        gsap.to('body', {
            backgroundColor: root.classList.contains('dark') ? '#111827' : '#f3f4f6',
            duration: 0.5
        });
        
        localStorage.setItem('darkMode', root.classList.contains('dark'));
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Initialize dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }

    // Add task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskInput = document.getElementById('taskInput');
        const taskPriority = document.getElementById('taskPriority');
        const taskCategory = document.getElementById('taskCategory');
        const taskDate = document.getElementById('taskDate');

        if (taskInput.value.trim() === '') return;

        const task = {
            id: Date.now(),
            text: taskInput.value,
            completed: false,
            priority: taskPriority.value,
            category: taskCategory.value,
            date: taskDate.value,
            createdAt: new Date()
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    // Update the renderTasks function to include animations
    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        
        const filteredTasks = filter === 'all' 
            ? tasks 
            : tasks.filter(task => task.category === filter);

        filteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item priority-${task.priority} 
                animate__animated animate__fadeIn`;
            if (task.completed) taskElement.classList.add('completed');

            taskElement.innerHTML = `
                <div class="flex items-center space-x-4">
                    <input type="checkbox" class="checkbox" 
                        ${task.completed ? 'checked' : ''}>
                    <div>
                        <p class="text-gray-800 dark:text-white">${task.text}</p>
                        <p class="text-sm text-gray-500">
                            ${new Date(task.date).toLocaleString()}
                        </p>
                    </div>
                </div>
                <button class="delete-btn">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" 
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                            stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            `;

            // Task event listeners
            const checkbox = taskElement.querySelector('.checkbox');
            const deleteBtn = taskElement.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(taskElement);

            // Add staggered animation
            gsap.from(taskElement, {
                opacity: 0,
                y: 20,
                duration: 0.4,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });
    };

    // Toggle task completion
    const toggleTask = (id) => {
        tasks = tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed} : task
        );
        saveTasks();
        renderTasks();
    };

    // Delete task
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    // Save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter-btn.active')
                .classList.remove('active');
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    // Add hover animations
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.task-item')) {
            gsap.to(e.target.closest('.task-item'), {
                scale: 1.02,
                duration: 0.2
            });
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.task-item')) {
            gsap.to(e.target.closest('.task-item'), {
                scale: 1,
                duration: 0.2
            });
        }
    });

    // Initial render
    renderTasks();
});