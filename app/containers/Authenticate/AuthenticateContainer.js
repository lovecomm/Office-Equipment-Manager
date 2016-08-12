import React, { PropTypes } from 'react'
import { Authenticate } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'redux/modules/users'
console.log(userActionCreators)

const AuthenticateContainer = React.createClass({
	propTypes: {
		isFetching: PropTypes.bool.isRequired,
		error: PropTypes.string.isRequired,
		dispatch: PropTypes.func,
		fetchAndHandleAuthedUser: PropTypes.func.isRequired,
	},
	contextTypes: {
		muiTheme: PropTypes.object,
	},
	handleAuth () {
		this.props.fetchAndHandleAuthedUser()
	},
	render () {
		return (
			<Authenticate
				palette={this.context.muiTheme.palette}
				isFetching={this.props.isFetching}
				error={this.props.error}
				onAuth={this.handleAuth} />
		)
	},
})

function mapStateToProps (state) { // this is where we say which parts of the state/store that we care about for this particular component
	console.log(state)
	return {
		isFetching: state.isFetching,
		error: state.error,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(userActionCreators, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthenticateContainer) // connect returns a function, then AuthenticateContainer will be sent as a param to that function
