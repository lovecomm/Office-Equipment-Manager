import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'redux/modules/users'
import { formatUserInfo } from 'helpers/utils'
import { firebaseAuth } from 'config/constants'
import { Loader, Navigation } from 'components'
import { FormsDrawersContainer } from 'containers'
import { ThemeProvider } from 'react-css-themr'
import { container, innerContainer } from './styles.css'

const MainContainer = React.createClass({
	propTypes: {
		children: PropTypes.node,
		isAuthed: PropTypes.bool.isRequired,
		isFetching: PropTypes.bool.isRequired,
		authUser: PropTypes.func.isRequired,
		fetchingUserSuccess: PropTypes.func.isRequired,
		removeFetchingUser: PropTypes.func.isRequired,
	},
	componentDidMount () {
		firebaseAuth().onAuthStateChanged((user) => {
			if (user) { // user existing means that we're logged in
				const userData = user.providerData[0]
				const userInfo = formatUserInfo(userData.displayName, user.uid)
				this.props.authUser(user.uid)
				this.props.fetchingUserSuccess(user.uid, userInfo, Date.now())
			} else {
				this.props.removeFetchingUser()
			}
		})
	},
	render () {
		return this.props.isFetching === true
			? <Loader size={2} /> // We want this b/c there is going to be some lag while the Auth check is running
			: (<ThemeProvider>
				<div className={container}>
					<Navigation isAuthed={this.props.isAuthed}/>
					<div className={innerContainer}>
						{this.props.children}
						{/* <FormsDrawersContainer /> */}
					</div>
					<FormsDrawersContainer />
				</div>
			</ThemeProvider>
		)
	},
})

function mapStateToProps ({users}) {
	return {
		isAuthed: users.isAuthed,
		isFetching: users.isFetching,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(userActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer)
