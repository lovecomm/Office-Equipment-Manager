import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { MainContainer, AuthenticateContainer, FeedContainer, LogoutContainer, HardwareContainer } from 'containers'

export default function getRoutes (checkAuth) {
	return (
		<Router history={hashHistory}>
			<Route path='/' component={MainContainer}>
				<Route path='auth' component={AuthenticateContainer} onEnter={checkAuth} />
				<Route path='logout' component={LogoutContainer} />
				<Route path='hardware' component={HardwareContainer} />
				<IndexRoute component={FeedContainer} onEnter={checkAuth} />
			</Route>
		</Router>
	)
}
