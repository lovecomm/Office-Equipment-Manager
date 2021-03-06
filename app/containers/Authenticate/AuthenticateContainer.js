import React, { PropTypes } from 'react'
import { Authenticate } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'redux/modules/users'
import FormData from 'react-form-data'

const AuthenticateContainer = React.createClass({
	propTypes: {
		isFetching: PropTypes.bool.isRequired,
		error: PropTypes.string.isRequired,
		params: PropTypes.object,
		fetchAndHandleAuthedUser: PropTypes.func.isRequired,
	},
	contextTypes: {
		router: PropTypes.object.isRequired,
	},
	mixins: [ FormData ],
	handleAuth (e) {
		e.preventDefault()
		this.props.fetchAndHandleAuthedUser(this.formData.email, this.formData.password)
			.then(() => {
				this.context.router.replace('/')
			})
	},
	render () {
		return (
			<div>
				<Authenticate
					isFetching={this.props.isFetching}
					error={this.props.error}
					handleFormData={this.updateFormData}
					onAuth={this.handleAuth} />
			</div>
		)
	},
})

function mapStateToProps ({users}) { // this is where we say which parts of the state/store that we care about for this particular component
	return {
		isFetching: users.isFetching,
		isLoggingOut: users.isLoggingOut,
		error: users.error,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(userActionCreators, dispatch)
}

export default connect(
	mapStateToProps
	, mapDispatchToProps
)(AuthenticateContainer) // connect returns a function, then AuthenticateContainer will be sent as a param to that function
