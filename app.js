// app.js - نسخة كاملة (إضافة + حذف + تعديل + تحديد مكتمل)

let currentEditItem = null;

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    
    if (taskText === "") {
        alert("الرجاء كتابة مهمة قبل الإضافة");
        return;
    }
    
    // إذا كان في تعديل قائم
    if (currentEditItem) {
        const taskTextSpan = currentEditItem.querySelector('.task-text');
        taskTextSpan.textContent = taskText;
        currentEditItem.classList.remove('editing');
        currentEditItem = null;
        document.querySelector('.add-btn').textContent = 'Add Task';
        input.value = "";
        return;
    }
    
    addTaskToDOM(taskText);
    saveToLocalStorage();
    input.value = "";
}

function addTaskToDOM(taskText, isCompleted = false) {
    const taskList = document.getElementById("taskList");
    
    // إزالة رسالة "لا توجد مهام" إذا كانت موجودة
    removeEmptyMessage();
    
    // إنشاء عنصر المهمة
    const li = document.createElement("li");
    li.className = isCompleted ? "completed" : "";
    
    // مربع تحديد (checkbox)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = isCompleted;
    checkbox.onclick = function() {
        toggleComplete(li);
    };
    
    // نص المهمة
    const taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.textContent = taskText;
    
    // زر تعديل
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit task";
    editBtn.onclick = function() {
        editTask(li, taskSpan.textContent);
    };
    
    // زر حذف
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Delete task";
    deleteBtn.onclick = function() {
        deleteTask(li);
    };
    
    // حاوية الأزرار
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";
    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);
    
    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(buttonGroup);
    
    taskList.appendChild(li);
}

function toggleComplete(liElement) {
    liElement.classList.toggle("completed");
    saveToLocalStorage();
}

function editTask(liElement, oldText) {
    const input = document.getElementById("taskInput");
    input.value = oldText;
    input.focus();
    
    currentEditItem = liElement;
    document.querySelector('.add-btn').textContent = 'Update Task';
    
    // إضافة تأثير بصري للمهمة الجاري تعديلها
    liElement.classList.add('editing');
}

function deleteTask(liElement) {
    if (confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
        liElement.remove();
        saveToLocalStorage();
        checkEmptyList();
    }
}

// التحقق من القائمة الفارغة
function checkEmptyList() {
    const taskList = document.getElementById("taskList");
    if (taskList.children.length === 0) {
        showEmptyMessage();
    }
}

function removeEmptyMessage() {
    const emptyMsg = document.querySelector('.empty-message');
    if (emptyMsg) emptyMsg.remove();
}

function showEmptyMessage() {
    const taskList = document.getElementById("taskList");
    if (taskList.children.length === 0) {
        const emptyMsg = document.createElement("div");
        emptyMsg.className = "empty-message";
        emptyMsg.innerHTML = "📭 No tasks yet. Add your first task above!";
        taskList.appendChild(emptyMsg);
    }
}

// حفظ المهام في localStorage
function saveToLocalStorage() {
    const tasks = [];
    const taskItems = document.querySelectorAll("#taskList li");
    
    taskItems.forEach(item => {
        const taskText = item.querySelector('.task-text').textContent;
        const isCompleted = item.classList.contains('completed');
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// تحميل المهام من localStorage
function loadFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
    
    checkEmptyList();
}

// تحميل المهام عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);