const addForm = document.querySelector('.add');
const searchInput = document.querySelector('.search input');
const todoListUL = document.querySelector('.list-group');

// Load existing tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

addForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
});

// Function to add a new todo
function addTodo() {
    const newTodo = document.querySelector("#todo").value.trim();
    if (newTodo.length) {
        createToDoItem(newTodo);
        saveTodos();
        addForm.reset();
    } else {
        alert('Please enter a Task!');
    }
}

// Function to Create a new task item
function createToDoItem(todo) {
    const taskHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${todo}</span>
            <i class="far fa-trash-alt delete"></i>
        </li>`;
    todoListUL.innerHTML += taskHTML;
}

// Function to Save tasks to localStorage
function saveTodos() {
    let tasks = [];
    document.querySelectorAll('.list-group-item span').forEach(item => {
        tasks.push(item.textContent);
    });
    localStorage.setItem("todo", JSON.stringify(tasks));
}

// Function to Load tasks from localStorage
function loadTasks() {
    todoListUL.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem('todo')) || [];
    tasks.forEach(createToDoItem);
}

// Delete a task
todoListUL.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete")) {
        const taskItem = e.target.parentElement;
        const taskText = taskItem.querySelector('span').textContent;
        taskItem.remove();
        let tasks = JSON.parse(localStorage.getItem('todo')) || [];
        tasks = tasks.filter(todo => todo !== taskText);
        localStorage.setItem("todo", JSON.stringify(tasks));
    }
});

// Filtering the To Do list while searching
const filtrer = (inputtext) => {
    const ulElement = document.querySelector(".todos");
    const listItems = ulElement.querySelectorAll("li");

    if (inputtext === "") {
        listItems.forEach(item => {
            item.style.display = ""; 
            item.style.visibility = ''; 
            item.style.position = '';
        });
        return;  
    }
    listItems.forEach(item => {
        const contenu = item.querySelector("span").textContent.toLowerCase().trim(); 
        if (contenu.includes(inputtext.toLowerCase())) {
            item.style.display = "";  
            item.style.visibility = ''; 
            item.style.position = ''; 
        } else {
            item.style.visibility = 'hidden';  
            item.style.position = "absolute"; 
        }
    });
};

searchInput.addEventListener("input", (e) => {
    const texto = e.target.value.trim(); 
    filtrer(texto);  
});