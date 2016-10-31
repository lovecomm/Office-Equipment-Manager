import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import { MainContainer, AuthenticateContainer, ItemsFeedContainer, LogoutContainer, PeopleFeedContainer, HardwaresFeedContainer } from 'containers'

export default function getRoutes (checkAuth, history) {
	return (
		<Router history={history}>
			<Route path='/' component={MainContainer}>
				<IndexRoute component={ItemsFeedContainer} onEnter={checkAuth} />
				<Route path='auth' component={AuthenticateContainer} onEnter={checkAuth} />
				<Route path='logout' component={LogoutContainer} />
				<Route path='people' component={PeopleFeedContainer} onEnter={checkAuth}/>
				<Route path='hardware' component={HardwaresFeedContainer} onEnter={checkAuth}/>
			</Route>
		</Router>
	)
}
