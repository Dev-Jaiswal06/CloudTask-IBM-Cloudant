const API = "http://localhost:5000/tasks";

let allTasks = [];

// Load all tasks
async function loadTasks() {
    try {
        const res = await fetch(API);
        allTasks = await res.json();
        renderTasks(allTasks);
    } catch (err) {
        console.error(err);
    }
}

// Render tasks
function renderTasks(data) {

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    document.getElementById("count").innerText = `Total Tasks : ${data.length}`;

    if (data.length === 0) {
        list.innerHTML = `<div class="empty">📭 No Tasks Found</div>`;
        return;
    }

    data.forEach(task => {

        list.innerHTML += `
        <div class="task">

            <span>${task.title}</span>

            <div class="actions">

                <button
                    class="edit"
                    onclick="editTask('${task._id}','${task.title}')">
                    Edit
                </button>

                <button
                    class="delete"
                    onclick="deleteTask('${task._id}')">
                    Delete
                </button>

            </div>

        </div>
        `;

    });

}

// Add Task
async function addTask() {

    const input = document.getElementById("taskInput");

    const title = input.value.trim();

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    try {

        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title
            })
        });

        input.value = "";

        await loadTasks();

        alert("✅ Task Added Successfully");

    } catch (err) {
        console.error(err);
    }

}

// Delete Task
async function deleteTask(id) {

    try {

        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        await loadTasks();

    } catch (err) {
        console.error(err);
    }

}

// Edit Task
async function editTask(id, oldTitle) {

    const newTitle = prompt("Update Task", oldTitle);

    if (!newTitle) return;

    try {

        await fetch(`${API}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: newTitle
            })

        });

        await loadTasks();

    } catch (err) {
        console.error(err);
    }

}

// Search Task
function searchTask() {

    const text = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = allTasks.filter(task =>
        task.title.toLowerCase().includes(text)
    );

    renderTasks(filtered);

}

// Enter key support
document
    .getElementById("taskInput")
    .addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            addTask();
        }

    });

// Initial Load
loadTasks();