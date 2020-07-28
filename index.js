// Random ID Generator
function generateId() {
	return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// /Random ID Generator

// App Code
const ADD_TODO = 'ADD_TODO',
	REMOVE_TODO = 'REMOVE_TODO',
	TOGGLE_TODO = 'TOGGLE_TODO',
	ADD_GOAL = 'ADD_GOAL',
	REMOVE_GOAL = 'REMOVE_GOAL';

// Actions
// --- TODOS
function addTodoAction(todo) {
	return {
		type: ADD_TODO,
		todo
	}
}

function removeTodoAction(id) {
	return {
		type: REMOVE_TODO,
		id
	}
}

function toggleTodoAction(id) {
	return {
		type: TOGGLE_TODO,
		id
	}
}

function todos(state = [], action) {
	switch (action.type) {
		case ADD_TODO :
			return state.concat([action.todo]);
		case REMOVE_TODO :
			return state.filter((todo) => todo.id !== action.id);
		case TOGGLE_TODO :
			return state.map((todo) => todo.id !== action.id ? todo :
				Object.assign({}, todo, {complete: !todo.complete}));
		default :
			return state;
	}
}

// --- /TODOS

// --- GOALS
function addGoalAction(goal) {
	return {
		type: ADD_GOAL,
		goal
	}
}

function removeGoalAction(id) {
	return {
		type: REMOVE_GOAL,
		id
	}
}

function goals(state = [], action) {
	switch (action.type) {
		case ADD_GOAL :
			return state.concat([action.goal]);
		case REMOVE_GOAL :
			return state.filter((goal) => goal.id !== action.id);
		default :
			return state;
	}
}

// --- /GOALS

// /Actions

// Middleware
const checker = (store) => (next) => (action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes('bitcoin')
  ) {
    return alert("Nope! That's a bad idea.");
  }
  
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes('bitcoin')
  ) {
    return alert("Nope! That's a bad idea.");
  }
  
  return next(action);
}

const logger = (store) => (next) => (action) => {
	console.group(action.type);
		console.log('The action is: ', action);
		const result = next(action);
		console.log('The new state is: ', store.getState());
	console.groupEnd();
	
	return result;
}

// /Middleware

// Store
const store = Redux.createStore(Redux.combineReducers({
	goals,
	todos
}), Redux.applyMiddleware(checker, logger));

store.subscribe(() => {
	const {goals, todos} = store.getState();
	
	document.getElementById('goals').innerHTML = '';
	document.getElementById('todos').innerHTML = '';
	
	goals.forEach(addGoalToDOM);
	todos.forEach(addTodoToDOM);
})

// /Store

// Listeners
function createRemoveButton(onClick) {
	const removeBtn = document.createElement('button')
	removeBtn.innerHTML = 'X'
	removeBtn.addEventListener('click', onClick)
	return removeBtn
}

function addTodo() {
	const input = document.getElementById('todo'),
		name = input.value;
	input.value = '';
  
  store.dispatch(addTodoAction({
		name,
		id: generateId(),
		complete: false
	}));
}

function addGoal() {
	const input = document.getElementById('goal'),
		name = input.value;
	input.value = '';
  
  store.dispatch(addGoalAction({
		name,
		id: generateId()
	}));
}

function addTodoToDOM(todo) {
	const node = document.createElement('li'),
		text = document.createTextNode(todo.name);
	
	const removeBtn = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
	});
	
	node.appendChild(text);
	node.appendChild(removeBtn);
	node.style.textDecoration = todo.complete ? 'line-through' : 'none';
	node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id));
	});
	
	document.getElementById('todos').appendChild(node);
}

function addGoalToDOM(goal) {
	const node = document.createElement('li');
	const text = document.createTextNode(goal.name);
	const removeBtn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
	});
	
	node.appendChild(text);
	node.appendChild(removeBtn);
	
	document.getElementById('goals').append(node);
}

document.getElementById('todoBtn').addEventListener('click', addTodo);

document.getElementById('goalBtn').addEventListener('click', addGoal);

// /Listeners