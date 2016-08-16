import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { MainContainer, AuthenticateContainer, ItemsContainer, LogoutContainer, HardwareContainer } from 'containers'

export default function getRoutes (checkAuth) {
	return (
		<Router history={hashHistory}>
			<Route path='/' component={MainContainer}>
				<Route path='auth' component={AuthenticateContainer} onEnter={checkAuth} />
				<Route path='logout' component={LogoutContainer} />
				<Route path='hardware' component={HardwareContainer} />
				<IndexRoute component={ItemsContainer} onEnter={checkAuth} />
			</Route>
		</Router>
	)
}
