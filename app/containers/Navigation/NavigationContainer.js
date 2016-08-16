import React, { PropTypes, Component } from 'react'
import { Navigation } from 'components'

class NavigationContainer extends Component {
	constructor (props) {
		super(props)
		this.state = {
			open: false,
			anchorEl: {},
		}
	}
	handleTouchTap = (event) => {
		// This prevents ghost click.
		event.preventDefault()
		this.setState({
			open: true,
			anchorEl: event.currentTarget,
		})
	}
	handleRequestClose = () => {
		this.setState({
			open: false,
		})
	}
	render () {
		return (
			<Navigation
				isAuthed={this.props.isAuthed}
				handleTouchTap={this.handleTouchTap}
				handleRequestClose={this.handleRequestClose}
				open={this.state.open}
				anchorEl={this.state.anchorEl}/>
		)
	}
}

NavigationContainer.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
}

export default NavigationContainer
