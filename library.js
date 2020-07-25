function createStore(reducer) {
	// The store should have four parts
	// 1. The state
	// 2. Get the state.
	// 3. Listen to changes on the state.
	// 4. Update the state
	
	let state,
		listeners = [];
	
	// Methods
	const getState = () => state;
	
	const subscribe = (listener) => {
		listeners.push(listener);
		
		return () => {
			listeners = listeners.filter((l) => l !== listener);
		}
	}
	
	const dispatch = (action) => {
		state = reducer(state, action);
		listeners.forEach((listener) => listener());
	}
	
	// /Methods
	
	return {
		getState,
		subscribe,
		dispatch
	}
}