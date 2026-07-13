const API = "/tasks";

let allTasks = [];
let currentFilter = "all";

async function loadTasks() {
    try {
        const res = await fetch(API);
        allTasks = await res.json();
        applyFilter();
    } catch (err) {
        console.error(err);
    }
}

function applyFilter() {
    let filtered = allTasks;

    if (currentFilter === "active") {
        filtered = allTasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        filtered = allTasks.filter(t => t.completed);
    }

    const text = document.getElementById("search").value.toLowerCase();
    if (text) {
        filtered = filtered.filter(t => t.title.toLowerCase().includes(text));
    }

    renderTasks(filtered);
}

function setFilter(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter();
}

function renderTasks(data) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    const countEl = document.getElementById("count");
    countEl.textContent = data.length ? `${data.length} task${data.length !== 1 ? "s" : ""}` : "";

    const clearBtn = document.getElementById("clearAll");
    clearBtn.style.display = allTasks.length > 0 ? "inline-block" : "none";

    if (data.length === 0) {
        const msg = currentFilter === "completed"
            ? "No completed tasks yet."
            : currentFilter === "active"
            ? "All done! Nothing pending."
            : "Nothing here yet. Add a task above.";
        list.innerHTML = `<div class="empty">${msg}</div>`;
        return;
    }

    data.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";
        const done = task.completed ? "done" : "";
        const btnLabel = task.completed ? "Undo" : "Done";
        div.innerHTML = `
            <span class="task-text ${done}">${task.title}</span>
            <div class="task-actions">
                <button class="btn-done" onclick="toggleDone('${task._id}', this)">${btnLabel}</button>
                <button class="btn-edit" onclick="startEdit('${task._id}', this)">Edit</button>
                <button class="btn-delete" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

async function toggleDone(id, btn) {
    const task = allTasks.find(t => t._id === id);
    if (!task) return;

    const newVal = !task.completed;

    try {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: task.title,
                completed: newVal
            })
        });
        task.completed = newVal;
        applyFilter();
    } catch (err) {
        console.error(err);
    }
}

async function addTask() {
    const input = document.getElementById("taskInput");
    const title = input.value.trim();

    if (!title) {
        input.focus();
        return;
    }

    try {
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });
        input.value = "";
        await loadTasks();
    } catch (err) {
        console.error(err);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        await loadTasks();
    } catch (err) {
        console.error(err);
    }
}

async function clearAll() {
    if (!confirm("Delete all tasks? This cannot be undone.")) return;

    try {
        await fetch(`${API}/all`, { method: "DELETE" });
        await loadTasks();
    } catch (err) {
        console.error(err);
    }
}

function startEdit(id, btn) {
    const task = btn.closest(".task");
    const textEl = task.querySelector(".task-text");
    const oldTitle = textEl.textContent;

    const input = document.createElement("input");
    input.className = "task-edit-input";
    input.value = oldTitle;

    textEl.replaceWith(input);
    input.focus();
    input.select();

    let saved = false;

    const save = async () => {
        if (saved) return;
        saved = true;

        const newTitle = input.value.trim();
        if (!newTitle || newTitle === oldTitle) {
            const span = document.createElement("span");
            span.className = "task-text";
            span.textContent = oldTitle;
            input.replaceWith(span);
            return;
        }

        try {
            await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle })
            });
            await loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") {
            saved = true;
            const span = document.createElement("span");
            span.className = "task-text";
            span.textContent = oldTitle;
            input.replaceWith(span);
        }
    });

    input.addEventListener("blur", save);
}

function searchTask() {
    applyFilter();
}

document.getElementById("taskInput").addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

loadTasks();
