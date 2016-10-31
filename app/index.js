import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import * as reducers from 'redux/modules'
import getRoutes from 'config/routes'
import { checkIfAuthed } from 'helpers/auth'
import { hashHistory } from 'react-router'
import { routerReducer, syncHistoryWithStore, routerMiddleware } from 'react-router-redux'

const middleware = routerMiddleware(history)
const store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer,
	}),
	compose(
		applyMiddleware(middleware, thunk),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
)
const history = syncHistoryWithStore(hashHistory, store)

function checkAuth (nextState, replace) {
	if (store.getState().users.isFetching === true) {
		return
	}

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
		{getRoutes(checkAuth, history)}
	</Provider>,
	document.getElementById('app')
)
