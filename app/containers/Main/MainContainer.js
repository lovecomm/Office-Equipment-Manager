import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'redux/modules/users'
import { formatUserInfo } from 'helpers/utils'
import { firebaseAuth } from 'config/constants'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { lightBlue900, lightBlue700, grey200, grey800, deepOrangeA700 } from 'material-ui/styles/colors'
import { Loader, MenuButton } from 'components'
import { NavigationContainer } from 'containers'
import { container, innerContainer } from './styles.css'

const muiTheme = getMuiTheme({
	palette: {
		primary1Color: lightBlue700,
		primary2Color: lightBlue900,
		primary3Color: grey200,
		primaryBlack: grey800,
		primaryDanger: deepOrangeA700,
	},
})

const MainContainer = React.createClass({
	propTypes: {
		children: PropTypes.node,
		isAuthed: PropTypes.bool.isRequired,
		isFetching: PropTypes.bool.isRequired,
		authUser: PropTypes.func.isRequired,
		fetchingUserSuccess: PropTypes.func.isRequired,
		removeFetchingUser: PropTypes.func.isRequired,
	},
	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},
	getChildContext () {
		return {muiTheme: getMuiTheme(baseTheme)}
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
			: (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className={container}>
					<NavigationContainer isAuthed={this.props.isAuthed}/>
					<div className={innerContainer}>
						{this.props.children}
					</div>
					<MenuButton isAuthed={this.props.isAuthed}/>
				</div>
			</MuiThemeProvider>
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
