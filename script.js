const taskinput = document.getElementById("taskinput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
let tasks = [];
addTaskButton.addEventListener("click", function () {
    const task = taskinput.value.trim();
    if (task === "") {
        alert("Please enter a task!");
        return;
    }
    tasks.push(task);
    displayTasks();
    taskinput.value = "";
    taskinput.focus();
});
    function displayTasks() {
    taskList.innerHTML = "";
    for (let i = 0; i < tasks.length; i++) {
        const li = document.createElement("li");
        li.innerText = tasks[i];
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", function () {
            tasks.splice(i, 1);
            displayTasks();
        });
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }
}
