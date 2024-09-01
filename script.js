const ASSIGNED_INITIAL_VALUE = 'Asignado 1';
const PRIORITY_INITIAL_VALUE = "Alta"
const STATE_INITIAL_VALUE = "Backlog";
let taskID = 0;

const tasks = [ {
    title: 'Tarjeta 1',
    description: 'Tarjeta de prueba 1',
    assigned: ASSIGNED_INITIAL_VALUE,
    priority: PRIORITY_INITIAL_VALUE,
    state: STATE_INITIAL_VALUE,
    deadline: "28/08/2024",
}];

document.addEventListener('DOMContentLoaded', () => {
    loadTasks(tasks);
});

const addTask = document.getElementById("agregar-tarea");
addTask.addEventListener("click", openModal);

const cancel = document.getElementById("cancelar");
cancel.addEventListener("click", closeModal);

const accept = document.getElementById("aceptar");
accept.addEventListener("click", addTaskHandler);

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
    closeModal();
    loadTasks(tasks);
}
    
function closeModal() {
    const modal = document.getElementById("modal-crear-tarea");
    const overlay = document.querySelector(".overlay");
    clearModal();
    modal.style.display = "none";
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
    switch (task.state) {
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
    }

    column.insertAdjacentHTML("beforeend", template);

    const cardHeader = column.lastElementChild;
    const priorityTag = cardHeader.querySelector('span.tag');
    const cardTitle = cardHeader.querySelector('p.title');

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

function openEditModal(taskIndex) {
    const task = tasks[taskIndex];

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

    const acceptEditButton = document.getElementById("aceptar-editar");
    acceptEditButton.onclick = function() {
        saveTaskChanges(taskIndex);
    }
}

function saveTaskChanges(taskIndex) {
    const task = tasks[taskIndex];

    task.title = document.getElementById("edit-task-title").value.trim();
    task.description = document.getElementById("edit-task-description").value.trim();
    task.assigned = document.getElementById("edit-task-assigned").value;
    task.priority = document.getElementById("edit-task-priority").value;
    task.state = document.getElementById("edit-task-status").value;
    task.deadline = document.getElementById("edit-deadline").value;
    closeModal();
    loadTasks(tasks);
}

