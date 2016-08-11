import React, { PropTypes } from 'react'
import { Authenticate } from 'components'
import auth from 'helpers/auth'

const AuthenticateContainer = React.createClass ({
	handleAuth () {
		auth().then((user) => {
			console.log('Authed User', user)
		})
	},
	render () {
		return (
			<Authenticate
				palette={this.context.muiTheme.palette}
				isFetching={false}
				error=''
				onAuth={this.handleAuth} />
		)
	},
})

AuthenticateContainer.contextTypes = {
	muiTheme: PropTypes.object.isRequired,
}

export default AuthenticateContainer
