import React, { PropTypes } from 'react'
import { Authenticate } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'redux/modules/users'
import FormData from 'react-form-data'
import { Snackbar } from 'material-ui'

const AuthenticateContainer = React.createClass({
	propTypes: {
		isFetching: PropTypes.bool.isRequired,
		isLoggingOut: PropTypes.bool.isRequired,
		error: PropTypes.string.isRequired,
		params: PropTypes.object,
		fetchAndHandleAuthedUser: PropTypes.func.isRequired,
		logoutAndUnauth: PropTypes.func.isRequired,
	},
	contextTypes: {
		muiTheme: PropTypes.object,
		router: PropTypes.object.isRequired,
	},
	mixins: [ FormData ],
	componentDidMount () {
		this.props.params.status === 'logout' ? this.props.logoutAndUnauth() : ''
	},
	handleAuth (e) {
		e.preventDefault()
		this.props.fetchAndHandleAuthedUser(this.formData.email, this.formData.password)
			.then(() => {
				this.context.router.replace('/')
			})
	},
	render () {
		console.log('PROPS ERROR', this.props.error)
		return (
			<div>
				<Authenticate
					palette={this.context.muiTheme.palette}
					isFetching={this.props.isFetching}
					error={this.props.error}
					handleFormData={this.updateFormData}
					onAuth={this.handleAuth} />
				<Snackbar
					open={this.props.isLoggingOut === true}
					message='You have successfuly signed out'
					autoHideDuration={4000}
					onRequestClose={this.handleRequestClose} />
			</div>
		)
	},
})

function mapStateToProps (state) { // this is where we say which parts of the state/store that we care about for this particular component
	return {
		isFetching: state.isFetching,
		isLoggingOut: state.isLoggingOut,
		error: state.error,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(userActionCreators, dispatch)
}

export default connect(
	mapStateToProps
	, mapDispatchToProps
)(AuthenticateContainer) // connect returns a function, then AuthenticateContainer will be sent as a param to that function
