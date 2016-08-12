import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { MainContainer, HomeContainer, AuthenticateContainer, ItemsContainer } from 'containers'

export default function getRoutes (checkAuth) {
	return (
		<Router history={hashHistory}>
			<Route path='/' component={MainContainer}>
				<Route path='auth' component={AuthenticateContainer} onEnter={checkAuth} />
				<Route path='auth/:status' component={AuthenticateContainer} onEnter={checkAuth} />
				<IndexRoute component={ItemsContainer} onEnter={checkAuth} />
			</Route>
		</Router>
	)
}
