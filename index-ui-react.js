function List(props) {
	return (
		<ul>
			{props.items.map((item) => (
				<li key={item.id}>
					<span onClick={() => props.toggleItem && props.toggleItem(item.id)}
					      style={{textDecoration: item.complete ? 'line-through' : 'none'}}>{item.name}</span>
					<button type="button"
					        onClick={() => props.removeItem(item)}>X
					</button>
				</li>
			))}
		</ul>
	);
}

class Todos extends React.Component {
	addItem = (e) => {
		e.preventDefault();
		
		return API.saveTodo(this.input.value)
			.then((todo) => {
				this.props.store.dispatch(addTodoAction(todo));
				this.input.value = '';
			})
			.catch(() => {
				alert('An error occurred!');
			});
	}
	
	removeItem = (todo) => {
		this.props.store.dispatch(removeTodoAction(todo.id));
		
		return API.deleteTodo(todo.id)
			.catch(() => {
				this.props.store.dispatch(addTodoAction(todo));
				
				alert('An error occurred!');
			});
	}
	
	toggleItem = (id) => {
		this.props.store.dispatch(toggleTodoAction(id));
		
		return API.saveTodoToggle(id)
			.catch(() => {
				this.props.store.dispatch(toggleTodoAction(id));
				
				alert('An error occurred!');
			});
	}
	
	render() {
		return (
			<div>
				<h2>TODOS</h2>
				<input type="text" placeholder="Add Todo"
				       ref={(input) => this.input = input} />
				<button type="button"
				        onClick={this.addItem}>Add Todo
				</button>
				<List items={this.props.todos}
				      toggleItem={this.toggleItem}
				      removeItem={this.removeItem} />
			</div>
		);
	}
}

class Goals extends React.Component {
	addItem = (e) => {
		e.preventDefault();
		
		return API.saveGoal(this.input.value)
			.then((goal) => {
				this.props.store.dispatch(addGoalAction(goal));
				this.input.value = '';
			})
			.catch(() => {
				alert('An error occurred!');
			});
	}
	
	removeItem = (goal) => {
		this.props.store.dispatch(removeGoalAction(goal.id));
		
		return API.deleteGoal(goal.id)
			.catch(() => {
				this.props.store.dispatch(addGoalAction(goal));
				
				alert('An error occurred!');
			});
	}
	
	render() {
		return (
			<div>
				<h2>GOALS</h2>
				<input type="text" placeholder="Add Goal"
				       ref={(input) => this.input = input} />
				<button type="button"
				        onClick={this.addItem}>Add Goal
				</button>
				<List items={this.props.goals}
				      removeItem={this.removeItem} />
			</div>
		);
	}
}

class App extends React.Component {
	componentDidMount() {
		const {store} = this.props;
		
		Promise.all([
			API.fetchTodos(),
			API.fetchGoals()
		]).then(([todos, goals]) => {
			store.dispatch(receiveDataAction(todos, goals));
		});
		
		store.subscribe(() => this.forceUpdate());
	}
	
	render() {
		const {store} = this.props,
			{todos, goals, loading} = store.getState();
		
		if (loading === true) {
			return (
				<h3>Loading...</h3>
			);
		}
		
		return (
			<div>
				<Todos todos={todos} store={this.props.store} /> <Goals goals={goals} store={this.props.store} />
			</div>
		);
	}
}

ReactDOM.render(
	<App store={store} />,
	document.getElementById('app')
);