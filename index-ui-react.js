const Context = React.createContext();

function connect(mapStateToProps) {
	return (Component) => {
		class Receiver extends React.Component {
			componentDidMount() {
				const {subscribe} = this.props.store;
				
				this.unsubscribe = subscribe(() => {
					this.forceUpdate();
				});
			}
			
			componentWillUnmount() {
				this.unsubscribe;
			}
			
			render() {
				const {dispatch, getState} = this.props.store,
					state = getState(),
					stateNeeded = mapStateToProps(state);
				
				return <Component {...stateNeeded} dispatch={dispatch} />;
			}
		}
		
		class ConnectedComponent extends React.Component {
			render() {
				return (
					<Context.Consumer>
						{(store) => (
							<Receiver store={store} />
						)}
					</Context.Consumer>
				)
			}
		}
		
		return ConnectedComponent;
	}
}

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

const ConnectedTodos = connect((state) => ({
	todos: state.todos
}))(Todos);

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

const ConnectedGoals = connect((state) => ({
	goals: state.goals
}))(Goals);

class App extends React.Component {
	componentDidMount() {
		const {dispatch} = this.props
		
		dispatch(handleInitialData());
	}
	
	render() {
		if (this.props.loading === true) {
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

const ConnectedApp = connect((state) => ({
	loading: state.loading
}))(App);

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