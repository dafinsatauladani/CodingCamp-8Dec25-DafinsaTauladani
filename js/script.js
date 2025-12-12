// Elements
const todoForm = document.getElementById("todoForm");
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");
const filterSelect = document.getElementById("filterSelect");

// State
let todos = [];
let currentFilter = "all";

// Format date
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Get status
function getStatus(todo) {
    const today = new Date().setHours(0,0,0,0);
    const due = new Date(todo.date).setHours(0,0,0,0);

    if (todo.completed) return "completed";
    if (due === today) return "today";
    if (due > today) return "upcoming";
    if (due < today) return "expired";
}

// Render list
function renderTodos() {
    todoList.innerHTML = "";

    const filtered = todos.filter(todo => {
        if (currentFilter === "all") return true;
        return getStatus(todo) === currentFilter;
    });

    filtered.forEach((todo, index) => {
        const card = document.createElement("div");
        card.className = "todo-card";

        const status = getStatus(todo);
        const color = {
            today: "text-yellow-400",
            upcoming: "text-green-400",
            expired: "text-red-500",
            completed: "text-blue-400"
        }[status];

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="space-y-1">
                    <h3 class="text-lg font-medium">${todo.title}</h3>
                    ${todo.description ? `<p class="text-gray-400">${todo.description}</p>` : ""}
                    <p class="text-sm ${color}">
                        <i class="fa-regular fa-calendar"></i> ${formatDate(todo.date)}
                    </p>
                </div>

                <div class="flex gap-3">
                    <button onclick="toggleComplete(${index})" 
                        class="hover:text-blue-400 transition">
                        <i class="fa-solid fa-check"></i>
                    </button>

                    <button onclick="deleteTodo(${index})"
                        class="hover:text-red-500 transition">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        todoList.appendChild(card);
    });
}

// Add Todo
todoForm.addEventListener("submit", e => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const date = dateInput.value;

    if (!title || !date) {
        alert("Title dan Due Date wajib diisi.");
        return;
    }

    todos.push({
        title,
        description: descInput.value.trim(),
        date,
        completed: false
    });

    todoForm.reset();
    renderTodos();
});

// Complete Todo
function toggleComplete(i) {
    todos[i].completed = !todos[i].completed;
    renderTodos();
}

// Delete Todo
function deleteTodo(i) {
    todos.splice(i, 1);
    renderTodos();
}

// Filter
filterSelect.addEventListener("change", e => {
    currentFilter = e.target.value;
    renderTodos();
});

// Initial
renderTodos();
