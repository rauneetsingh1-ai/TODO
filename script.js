//  THIS IS USED FOR EMAIL ENTER OR NOT
let generatedOTP="";// taking a variable for storing otp which will be generated
let currentUserEmail="";// mail variable for stroing which email has login 
let otpTime=0;
let editIndex = -1;
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-F9UrPZe_aNU4nGoKxvFXihvn3KA8VLuYhcP1lhpHCPp3ROx4_FA1ubc4tdyj0qkAtA/exec";
const timer = document.getElementById("timer");
const resendButton=document.getElementById("resendOtp");
let countdown;
console.log("js loaded");// jsut for checking weather the code has an error or not
const todoMessage=document.getElementById("todoMessage");// accesing todo jis bhi elemtn ka id todomessage hai use access kro html se 
const message=document.getElementById("message");//accessign the msg same id ke through access kro 
const otpsSection=document.getElementById("otpSection");// accesing the element id ke through access
const todoSection=document.getElementById("todoSection");// accessing the todosection id ke through access 
const emailInPut=document.getElementById("emailId");//accessing email via id id ke through access 
const otpButton=document.getElementById("gmail");// accesing gamil via id id ke through access 
otpButton.addEventListener("click",function(){// creating function which is checking the button response
    sendOtp();
});
// ###################for generating random code ########################
// for generating otp random number 6 digit code
function generateOTP(){
    return Math.floor(100000+Math.random()*900000);
}
function sendOtp(){
    const email=emailInPut.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;// regex function used for validating email 
   if (email === "") {// if emailis empty string then print the message
    message.innerText = "Please enter your email";
    return;
}
else if (!emailPattern.test(email)) {//if email doesnt passes the regex function
    message.innerText = "Invalid Email";
    return;
}
    else{
        otpButton.disabled = true;
        otpButton.innerText = "Sending...";
        message.innerText="";// removes the older error mesage (invalid email--> now blank)
        otpCode.value = "";
        otpTime = Date.now();// taking the real time becauseof data.now function
        startTimer();// to make the timer start 
     fetch(APP_SCRIPT_URL,{
            method:"POST",//sending data to server (that is email+otp)
            body:JSON.stringify({//used for easy transportaion of the data key value pair of the object ko string ke format me bhejna 
                action:"sendOTP",
                email:email// email variable and us email ke under ki value
            })
        })
        .then(response=>response.text())// waiting for the backend to respond....and read krta hai 
        .then(data=>{// data ko fetch kra i mean mangwaya
            otpButton.disabled = false;
            otpButton.innerText = "Send OTP";
            message.innerHTML="If the email exist,OTP has been sent!";// if the backend replies the this messgae 
            setTimeout(function(){// fucntion for setting a time limit to show case the login message 
            message.innerHTML="";// clearing the message after the settimeout function
        },3000);// sirf 3 second ke liye chlega
            console.log(data);// whatever the backend had replied print it in the console that is the otp
        })
        .catch(error=>{// agar data fetch ni ho paaya to fiding error like netowrk and other 
            otpButton.disabled = false;
            otpButton.innerText = "Send OTP";
            console.log(error);// to user ko error show krdo
        });
    }
}
resendButton.addEventListener("click", function () {
      console.log("Resend button clicked");
    sendOtp();

});

// fucntion for otp timer validation
function startTimer() {
    clearInterval(countdown);// stop krdo if any existing timer chl rha hai
    resendButton.disabled=true;// her baar jb nayi otp genrate hogi to button disabled rhega for a period of time
    let timeLeft = 60;// seting initial time to 60
    countdown = setInterval(function () {// start repeating everysecond 
        // repetedly runs the provided function after fixed interval 
        timer.innerHTML = "OTP expires in: " + timeLeft + " sec";// timer display
        timeLeft--; // time decreasing one by one
        if (timeLeft < 0) {// time jb tk zero se upper hai
            clearInterval(countdown);// stop the timer 
            timer.innerHTML = "OTP Expired";// and display 
            resendButton.disabled=false;
        }
    }, 1000);// time interval duration
}

// Taking otp code input from the user otp genration otp verification user login+task loading 
const otpCode=document.getElementById("codeId");// for accessing the otp element
const verifyButton=document.getElementById("otpVerify");// for accessing the otp
verifyButton.addEventListener("click",function(){// making a function for button
    const enteredOtp=otpCode.value.trim();//take the otp entered by the user and trim the value access the otp value
    const loginEmail=emailInPut.value.trim();
    if(enteredOtp===""){// agar entered otp khaali hai 
        message.innerHTML="please enter the valid otp";// print this 
        return;// and get out of the loop 
    }

    verifyButton.disabled = true;
    verifyButton.innerText = "Verifying...";

    fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
        action: "verifyOTP",
        email: loginEmail,
        otp: enteredOtp
    })
})
.then(response => response.text())
.then(result => {
    verifyButton.disabled = false;
    verifyButton.innerText = "Verify OTP";
    if (result === "SUCCESS") {
    message.innerHTML = "";// pops the msg for the user login success
    currentUserEmail = loginEmail;// verified user ko store kr lete hai
    localStorage.setItem("currentUserEmail", currentUserEmail);
    otpsSection.style.display = "none";// clearing the page
    todoSection.style.display = "block";// reloading the todo section

    // fetch login hote hi backend ko request bhejna
    loadUserTasks();

    showToast("Login Successful", "success");
}
else if (result === "EXPIRED") {
    message.innerHTML = "OTP expired. Please request a new OTP.";
}
else {
    message.innerHTML = "Invalid OTP";
}
   
})
.catch(error => {
    verifyButton.disabled = false;
    verifyButton.innerText = "Verify OTP";
    console.log(error);
    message.innerHTML="Verification failed";
});
});
// =================================================== todo app
const taskinput = document.getElementById("taskinput");// pure elemnt of the code ko call kro
const addTaskButton = document.getElementById("addTaskButton");// same
const logoutButton=document.getElementById("logoutButton");// for logout button

function loadUserTasks() {
    fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "getTasks",
            email: currentUserEmail
        })
    })
    .then(response => response.json())
    .then(data => {
        tasks = data;
        displayTasks();
    })
    .catch(error => console.log(error));
}

function restoreSession() {
    const savedEmail = localStorage.getItem("currentUserEmail");
    if (savedEmail) {
        currentUserEmail = savedEmail;
        otpsSection.style.display = "none";
        todoSection.style.display = "block";
        loadUserTasks();
    }
}

logoutButton.addEventListener("click",function(){// function creation for logout button
// alert("logout button clicked");
taskinput.value="";// ye ckear kr deta hai taskinput box ko 
tasks=[];// jo bhi task hm de rhe haiunhe store kr rha hai array me 
displayTasks();// ye task ko show kr rhe hai 
todoSection.style.display="none";// clear the todo screen and removes from the display
otpsSection.style.display="block";// get back the otp section and show it the user 
document.getElementById("emailId").value="";// clear the previously entered email id 
document.getElementById("codeId").value="";// celar the previously entered otp 
todoMessage.innerHTML="";// todo section ka message remove krte hai 
currentUserEmail="";// jo email hai vo bhi clear ho jaaye 
localStorage.removeItem("currentUserEmail");


});
const taskList = document.getElementById("taskList");// id ke through call kro
let tasks = [];// array ko declare kiya hai for taking input of the task
let toastTimeout = null;

restoreSession();
const toastContainer = document.createElement("div");
toastContainer.id = "toast-container";
document.body.appendChild(toastContainer);

function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.replaceChildren(toast);

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add("toast-hide");
        setTimeout(() => {
            toastContainer.replaceChildren();
        }, 300);
    }, 3000);
}

addTaskButton.addEventListener("click", function () {// jb bhi button click hoga ye function call hoga
    const task = taskinput.value.trim();// input value lo box se and agar faltu space hai to trim krdo
    if (task === "") {// check kro khali string to nhi hai input box me
        showToast("Please enter a task", "error");
        return;// and function se bahar aaajao
    }

    addTaskButton.disabled = true;
    addTaskButton.innerText = "Adding...";

    if (editIndex !== -1) {
        const oldTask = tasks[editIndex].task;
        fetch(APP_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "editTask",
                email: currentUserEmail,
                oldTask: oldTask,
                newTask: task
            })
        })
        .then(response => response.text())
        .then(data => {
            addTaskButton.disabled = false;
            addTaskButton.innerText = "ADD TASK";
            if (data === "Task Edited") {
                tasks[editIndex].task = task;
                displayTasks();
                taskinput.value = "";
                editIndex = -1;
                todoMessage.innerText = "";
                taskinput.focus();
            }
            else {
                showToast("Task could not be edited", "error");
            }
        })
        .catch(error => {
            addTaskButton.disabled = false;
            addTaskButton.innerText = "ADD TASK";
            console.log(error);
            showToast("Task could not be edited", "error");
        });
        return;
    }
    todoMessage.innerText="";
    fetch(APP_SCRIPT_URL,{
        method:"POST",
        body:JSON.stringify({
            action:"addTask",
            email:currentUserEmail,
            task:task
        })
    })
    .then(response=>response.text())
    .then(data=>{
        addTaskButton.disabled = false;
        addTaskButton.innerText = "ADD TASK";
        if (data === "Task Saved") {
            tasks.push({
                task:task,
                completed:false
            });
            displayTasks();
            taskinput.value = "";
            taskinput.focus();
        }
        else {
            showToast("Task could not be added", "error");
        }
        console.log(data);
    })
    .catch(error=>{
        addTaskButton.disabled = false;
        addTaskButton.innerText = "ADD TASK";
        console.log(error);
        showToast("Task could not be added", "error");
    });
});
    function displayTasks() {// ye function saare task ko display per dikhata hai
    taskList.innerHTML = "";// idhar pehle puraani list ko clear kr rhe hai for no duplicate things get formed
    for (let i = 0; i < tasks.length; i++) {// aray k her ek task ke liye loop chalaoss
        const li = document.createElement("li");// ek nya list element bnao
        const buttonContainer=document.createElement("div");
        buttonContainer.classList.add("button-container");
        li.innerText = tasks[i].task;// current task jo bhi user ne likha use list me likho
        if(tasks[i].completed){
            li.style.textDecoration="line-through";
        }
        const editButton = document.createElement("button");
editButton.classList.add("edit-btn");
editButton.innerText = "Edit";
        const completeButton=document.createElement("button");// creation of complete button
        completeButton.classList.add("complete-btn");
        completeButton.innerText="Complete";// inner text of complete button
        if(tasks[i].completed){
            completeButton.innerText="Undo";
        }
        else{
            completeButton.innerText="complete";
        }
        completeButton.addEventListener("click",function(){// function for executing complete button 
            tasks[i].completed=!tasks[i].completed;//for making the button do undo and completed basically for switching 
           fetch(APP_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
        action: "updateTask",
        email: currentUserEmail,
        task: tasks[i].task,
        completed: tasks[i].completed
    })
})
.then(response => response.text())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.log(error);
});
        
            displayTasks();
           
        });
        editButton.addEventListener("click", function () {
    taskinput.value = tasks[i].task;
    editIndex=i;
});
        const deleteButton = document.createElement("button");// naya delete button bnao
         deleteButton.classList.add("delete-btn");
        deleteButton.innerText = "Delete";// button per delete likha hai
       deleteButton.addEventListener("click", function () {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) {
        return;
    }
    fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "deleteTask", // Tell backend to delete the task
            email: currentUserEmail, // Logged-in users email
            task: tasks[i].task// Task to be deleted
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        tasks.splice(i, 1);// Remove task from frontend array
        displayTasks();// Refresh the UI
        showToast("Task deleted successfully", "success");
    })
    .catch(error => {
        console.log(error);
    });
});
        // li.appendChild(completeButton);
        // li.appendChild(deleteButton); // append child is used for adding one element into another element
        // taskList.appendChild(li);
        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    }
}