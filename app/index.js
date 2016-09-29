import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import * as reducers from 'redux/modules'
import getRoutes from 'config/routes'
import { checkIfAuthed } from 'helpers/auth'

const store = createStore(
	combineReducers(reducers),
	compose(
		applyMiddleware(thunk),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
)

function checkAuth (nextState, replace) {
	
	const isAuthed = checkIfAuthed(store)
	const nextPathName = nextState.location.pathname
	if (nextPathName === '/auth') {
		if (isAuthed === true) {
			replace('/')
		}
	} else {
		if (isAuthed !== true) {
			replace('/auth')
		}
	}
}

ReactDOM.render(
	<Provider store={store}>
		{getRoutes(checkAuth)}
	</Provider>,
	document.getElementById('app')
)
