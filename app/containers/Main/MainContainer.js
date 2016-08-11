import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { lightBlue900, white, lightBlue700, grey400 } from 'material-ui/styles/colors'
import { Navigation } from 'components'
import { container, innerContainer } from './styles.css'

const muiTheme = getMuiTheme({
	palette: {
		primary1Color: lightBlue700,
		primary2Color: lightBlue900,
		primary3Color: lightBlue900,
	},
	appBar: {
		// height: 50,
	},
})

const MainContainer = React.createClass({
	render () {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className={container}>
					<Navigation isAuthed={true} />
					<div className={innerContainer}>
						{this.props.children}
					</div>
				</div>
			</MuiThemeProvider>
		)
	},
})

export default MainContainer
