const Context = React.createContext();

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
		
		this.props.dispatch(handleAddTodo(
			this.input.value,
			() => this.input.value = ''
		));
	}
	
	removeItem = (todo) => {
		this.props.dispatch(handleDeleteTodo(todo));
	}
	
	toggleItem = (id) => {
		this.props.dispatch(handleToggleTodo(id));
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

class ConnectedTodos extends React.Component {
	render() {
		return (
			<Context.Consumer>
				{(store) => {
					const {todos} = store.getState();
					
					return <Todos todos={todos} dispatch={store.dispatch} />
				}}
			</Context.Consumer>
		);
	}
}

class Goals extends React.Component {
	addItem = (e) => {
		e.preventDefault();
		
		this.props.dispatch(handleAddGoal(
			this.input.value,
			() => this.input.value = ''
		));
	}
	
	removeItem = (goal) => {
		this.props.dispatch(handleDeleteGoal(goal));
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

class ConnectedGoals extends React.Component {
	render() {
		return (
			<Context.Consumer>
				{(store) => {
					const {goals} = store.getState();
					
					return <Goals goals={goals} dispatch={store.dispatch} />
				}}
			</Context.Consumer>
		);
	}
}

class App extends React.Component {
	componentDidMount() {
		const {store} = this.props;
		
		store.dispatch(handleInitialData());
		
		store.subscribe(() => this.forceUpdate());
	}
	
	render() {
		const {store} = this.props,
			{loading} = store.getState();
		
		if (loading === true) {
			return (
				<h3>Loading...</h3>
			);
		}
		
		return (
			<div>
				<ConnectedTodos />
				<ConnectedGoals />
			</div>
		);
	}
}

class ConnectedApp extends React.Component {
	render() {
		return (
			<Context.Consumer>
				{(store) => (
					<App store={store} />
				)}
			</Context.Consumer>
		);
	}
}

class Provider extends React.Component {
	render() {
		return (
			<Context.Provider value={this.props.store}>
				{this.props.children}
			</Context.Provider>
		);
	}
}

ReactDOM.render(
	<Provider store={store}>
		<ConnectedApp />
	</Provider>,
	document.getElementById('app')
);