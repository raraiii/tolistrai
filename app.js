document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.querySelector('.todo-input');
  const todoList = document.querySelector('.todo-list');
  const filterOption = document.querySelector('.filter-todo');

  // Load todos from localStorage when the DOM content is loaded
  getTodos();

  // Event listeners
  todoForm.addEventListener('submit', addTodo);
  todoList.addEventListener('click', handleTodoClick);
  filterOption.addEventListener('change', filterTodo);

  // Functions
  function addTodo(e) {
    e.preventDefault();

    const todoText = todoInput.value.trim();
    if (todoText === '') return;

    const todoItem = document.createElement('li');
    todoItem.classList.add('todo');
    todoItem.innerHTML = `
      <span class="todo-text">${todoText}</span>
      <button class="complete-btn">Complete</button>
      <button class="delete-btn">Delete</button>
    `;

    todoList.appendChild(todoItem);
    saveLocalTodos(todoText);
    todoInput.value = '';
  }

  function handleTodoClick(e) {
    const item = e.target;

    if (item.classList.contains('delete-btn')) {
      const todo = item.parentElement;
      todo.remove();
      removeLocalTodos(todo);
    }

    if (item.classList.contains('complete-btn')) {
      const todo = item.parentElement;
      todo.classList.toggle('completed');
      updateLocalTodos();
    }
  }

  function filterTodo() {
    const todos = todoList.childNodes;
    const filter = filterOption.value;
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

    todos.forEach(todo => {
      const todoText = todo.querySelector('.todo-text').innerText;
      const todoDate = getLocalTodoDate(todoText); // Get the date for this todo item

      switch (filter) {
        case 'all':
          todo.style.display = 'flex';
          break;
        case 'completed':
          todo.style.display = todo.classList.contains('completed') ? 'flex' : 'none';
          break;
        case 'uncompleted':
          todo.style.display = !todo.classList.contains('completed') ? 'flex' : 'none';
          break;
        case 'today':
          todo.style.display = (todoDate === today) ? 'flex' : 'none';
          break;
        default:
          todo.style.display = 'flex';
      }
    });
  }

  function saveLocalTodos(todo) {
    const todos = getLocalTodos();
    const todoDate = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    todos.push({ text: todo, date: todoDate, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function getLocalTodos() {
    return localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));
  }

  function getLocalTodoDate(todoText) {
    const todos = getLocalTodos();
    const todo = todos.find(todo => todo.text === todoText);
    return todo ? todo.date : null;
  }

  function getTodos() {
    const todos = getLocalTodos();
    todos.forEach(todo => {
      const todoItem = document.createElement('li');
      todoItem.classList.add('todo');
      if (todo.completed) {
        todoItem.classList.add('completed');
      }
      todoItem.innerHTML = `
        <span class="todo-text">${todo.text}</span>
        <button class="complete-btn">Complete</button>
        <button class="delete-btn">Delete</button>
      `;
      todoList.appendChild(todoItem);
    });
  }

  function removeLocalTodos(todo) {
    let todos = getLocalTodos();
    const todoText = todo.querySelector('.todo-text').innerText;
    todos = todos.filter(t => t.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function updateLocalTodos() {
    const todos = [];
    todoList.childNodes.forEach(todo => {
      const todoText = todo.querySelector('.todo-text').innerText;
      const todoDate = getLocalTodoDate(todoText); // Get the date for this todo item
      const completed = todo.classList.contains('completed');
      todos.push({ text: todoText, date: todoDate, completed: completed });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
  }
});
  