import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import users from 'redux/modules/users'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getRoutes from 'config/routes'
import { checkIfAuthed } from 'helpers/auth'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const logger = createLogger()
const store = createStore(
	users,
	compose(
		applyMiddleware(thunk, logger),
		window.devToolsExtension ? window.devToolsExtension() : (f) => f
	)
)

function checkAuth (nextState, replace) {
	if (store.getState().isFetching === true) {
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
		{getRoutes(checkAuth)}
	</Provider>,
	document.getElementById('app')
)
