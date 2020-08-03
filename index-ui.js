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

// Store
store.subscribe(() => {
	const {goals, todos} = store.getState();
	
	document.getElementById('goals').innerHTML = '';
	document.getElementById('todos').innerHTML = '';
	
	goals.forEach(addGoalToDOM);
	todos.forEach(addTodoToDOM);
});

// /Store