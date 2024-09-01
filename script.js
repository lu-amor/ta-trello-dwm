const ASSIGNED_INITIAL_VALUE = 'Asignado 1';
const PRIORITY_INITIAL_VALUE = "Alta"
const STATE_INITIAL_VALUE = "Backlog";
let taskID = 0;
let editingTaskId = null; 

const tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    loadTasks(tasks);
});

const addTask = document.getElementById("agregar-tarea");
addTask.addEventListener("click", openModal);

const cancel = document.getElementById("cancelar");
cancel.addEventListener("click", closeModalCrear);

const cancelEdit = document.getElementById("cancelar-editar");
cancelEdit.addEventListener("click", closeModalEditar);

const accept = document.getElementById("aceptar");
accept.addEventListener("click", addTaskHandler);

const acceptEdit = document.getElementById("aceptar-editar");
acceptEdit.addEventListener("click", saveTaskChanges);

const deleteEdit = document.getElementById("eliminar-editar");
deleteEdit.addEventListener("click", () => {
    deleteTask(editingTaskId);
    closeModalEditar();
    loadTasks(tasks);
});

const modal = document.getElementById("modal-crear-tarea");
modal.addEventListener('click', (event) => {
    event.stopPropagation();
});

window.addEventListener('click', closeModal);

function openModal(event) {
    event.preventDefault();
    event.stopPropagation();
    const modal = document.getElementById("modal-crear-tarea");
    const overlay = document.querySelector(".overlay");
    modal.style.display = "flex";
    overlay.style.display = "block";
}
    
function addTaskHandler() {
    const titulo = document.getElementById("task-title").value.trim();
    const descripcion = document.getElementById("task-description").value.trim();
    const asignado = document.getElementById("task-assigned").value;
    const prioridad = document.getElementById("task-priority").value;
    const estado = document.getElementById("task-status").value;
    const fecha = document.getElementById("deadline").value;
    const id = taskID++;

    if (titulo === "" || fecha === "") {
        window.alert("Debes completar todos los campos.");
        return;
    }

    const task = {
        title: titulo,
        description: descripcion,
        assigned: asignado,
        priority: prioridad,
        state: estado,
        deadline: fecha,
        id: id,
    };

    tasks.push(task);
    createTask(task)
    closeModalCrear();
    loadTasks(tasks);
}
    
function closeModalCrear() {
    const modal = document.getElementById("modal-crear-tarea");
    const overlay = document.querySelector(".overlay");
    clearModal();
    modal.style.display = "none";
    overlay.style.display = "none";
}

function closeModalEditar() {
    const editModal = document.getElementById("modal-editar-tarea");
    const overlay = document.querySelector(".overlay");
    clearModal();
    editModal.style.display = "none";
    overlay.style.display = "none";
}
    
function clearModal() {
    document.getElementById("task-title").value = '';
    document.getElementById("task-description").value = '';
    document.getElementById("task-assigned").value = "Persona 1";
    document.getElementById("task-priority").value = "Alta";
    document.getElementById("task-status").value = "Backlog";
    document.getElementById("deadline").value = '';
}
    
function createTask(task) {
    const template = `
    <div class="card">
        <div class="titulo-tarjeta">
            <span class="tag"></span>
            <p class="title is-5"></p>
        </div>
    </div>`;

    let column;
    switch (task.state.toLowerCase()) {
        case "backlog":
            column = document.getElementById("backlog");
            break;
        case "to-do":
            column = document.getElementById("to-do");
            break;
        case "in progress":
            column = document.getElementById("in-progress");
            break;
        case "blocked":
            column = document.getElementById("blocked");
            break;
        case "done":
            column = document.getElementById("done");
            break;
        default:
            console.error("Estado no válido");
            return;
    }

    column.insertAdjacentHTML("beforeend", template);

    const cardElement = column.lastElementChild;
    const priorityTag = cardElement.querySelector('span.tag');
    const cardTitle = cardElement.querySelector('p.title');

    switch (task.priority) {
        case "Alta":
            priorityTag.classList.add("is-danger");
            break;
        case "Media":
            priorityTag.classList.add("is-warning");
            break;
        case "Baja":
            priorityTag.classList.add("is-success");
            break;
        case "Arreglar":
            priorityTag.classList.add("is-info");
            break;
        case "Extras":
            priorityTag.classList.add("is-primary");
            break;
        default:
            priorityTag.classList.add("is-light");
            break;
    }

    cardTitle.textContent = task.title;

    cardElement.addEventListener('click', () => openEditModal(task.id));
}

function loadTasks(tasks) {
    document.querySelectorAll('.tasks').forEach(column => column.innerHTML = '');

    tasks.forEach((task, index) => {
        createTask(task, index);
    });
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);

    editingTaskId = taskId;

    document.getElementById("edit-task-title").value = task.title;
    document.getElementById("edit-task-description").value = task.description;
    document.getElementById("edit-task-assigned").value = task.assigned;
    document.getElementById("edit-task-priority").value = task.priority;
    document.getElementById("edit-task-status").value = task.state;
    document.getElementById("edit-deadline").value = task.deadline;

    const editModal = document.getElementById("modal-editar-tarea");
    const overlay = document.querySelector(".overlay");
    editModal.style.display = "flex";
    overlay.style.display = "block";
}

function saveTaskChanges() {
    const task = tasks.find(t => t.id === editingTaskId);

    task.title = document.getElementById("edit-task-title").value.trim();
    task.description = document.getElementById("edit-task-description").value.trim();
    task.assigned = document.getElementById("edit-task-assigned").value;
    task.priority = document.getElementById("edit-task-priority").value;
    task.state = document.getElementById("edit-task-status").value;
    task.deadline = document.getElementById("edit-deadline").value;
    
    closeModalEditar();
    loadTasks(tasks);
}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);

        const taskElement = document.getElementById(`task-${taskId}`);
        
        if (taskElement) {
            taskElement.remove();
        } else {
            console.error(`Task element with ID task-${taskId} not found in the DOM.`);
        }
    } else {
        console.error(`Task with ID ${taskId} not found in the tasks array.`);
    }
    closeModalEditar();
}


