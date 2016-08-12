import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import users from 'redux/modules/users'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Routes from 'config/routes'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const logger = createLogger()
const store = createStore(
	users,
	applyMiddleware(logger, thunk)
)

ReactDOM.render(
	<Provider store={store}>
		{Routes}
	</Provider>,
	document.getElementById('app')
)
