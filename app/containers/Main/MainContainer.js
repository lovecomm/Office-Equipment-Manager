import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { lightBlue900, lightBlue700, grey200, grey800, deepOrangeA700 } from 'material-ui/styles/colors'
import { Navigation } from 'components'
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
	},
	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},
	getChildContext () {
		return {muiTheme: getMuiTheme(baseTheme)}
	},
	render () {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className={container}>
					<Navigation isAuthed={this.props.isAuthed}/>
					<div className={innerContainer}>
						{this.props.children}
					</div>
				</div>
			</MuiThemeProvider>
		)
	},
})

function mapStateToProps (state) {
	return {
		isAuthed: state.isAuthed,
	}
}

export default connect(mapStateToProps)(MainContainer)
