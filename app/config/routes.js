import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { MainContainer, AuthenticateContainer, ItemsFeedContainer, LogoutContainer, PeopleFeedContainer, HardwaresFeedContainer } from 'containers'

export default function getRoutes (checkAuth) {
	return (
		<Router history={hashHistory}>
			<Route path='/' component={MainContainer}>
				<Route path='auth' component={AuthenticateContainer} onEnter={checkAuth} />
				<Route path='logout' component={LogoutContainer} />
				<Route path='people' component={PeopleFeedContainer} onEnter={checkAuth}/>
				<Route path='hardware' component={HardwaresFeedContainer} onEnter={checkAuth}/>
				<IndexRoute component={ItemsFeedContainer} onEnter={checkAuth}/>
			</Route>
		</Router>
	)
}
