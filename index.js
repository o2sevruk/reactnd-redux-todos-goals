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
	REMOVE_GOAL = 'REMOVE_GOAL',
	RECEIVE_DATA = 'RECEIVE_DATA';

// Actions
// --- OVERALL
function loading(state = true, action) {
	switch (action.type) {
		case RECEIVE_DATA :
			return false;
		default :
			return state;
	}
}

function receiveDataAction(todos, goals) {
	return {
		type: RECEIVE_DATA,
		todos,
		goals
	}
}

function handleInitialData() {
	return (dispatch) => {
		return Promise.all([
			API.fetchTodos(),
			API.fetchGoals()
		]).then(([todos, goals]) => {
			dispatch(receiveDataAction(todos, goals));
		});
	}
}

// --- /OVERALL

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

function handleAddTodo(name, cb) {
	return (dispatch) => {
		return API.saveTodo(name)
			.then((todo) => {
				dispatch(addTodoAction(todo));
				cb();
			})
			.catch(() => {
				alert('An error occurred!');
			});
	}
}

function handleDeleteTodo(todo) {
	return (dispatch) => {
		dispatch(removeTodoAction(todo.id))
		
		return API.deleteTodo(todo.id)
			.catch(() => {
				dispatch(addTodoAction(todo))
				alert('An error occurred. Try again.')
			})
	}
}

function handleToggleTodo(id) {
	return (dispatch) => {
		dispatch(toggleTodoAction(id));
		
		return API.saveTodoToggle(id)
			.catch(() => {
				dispatch(toggleTodoAction(id));
				
				alert('An error occurred!');
			});
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
		case RECEIVE_DATA :
			return action.todos
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

function handleAddGoal(name, cb) {
	return (dispatch) => {
		return API.saveGoal(name)
			.then((goal) => {
				dispatch(addGoalAction(goal));
				cb();
			})
			.catch(() => {
				alert('An error occurred!');
			});
	}
}

function handleDeleteGoal(goal) {
	return (dispatch) => {
		dispatch(removeGoalAction(goal.id));
		
		return API.deleteGoal(goal.id)
			.catch(() => {
				dispatch(addGoalAction(goal));
				
				alert('An error occurred!');
			});
	}
}

function goals(state = [], action) {
	switch (action.type) {
		case ADD_GOAL :
			return state.concat([action.goal]);
		case REMOVE_GOAL :
			return state.filter((goal) => goal.id !== action.id);
		case RECEIVE_DATA :
			return action.goals
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