import React, { PropTypes, Component } from 'react'
import { Navigation } from 'components'

class NavigationContainer extends Component {
	render () {
		return (
			<Navigation
				isAuthed={this.props.isAuthed} />
		)
	}
}

NavigationContainer.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
}

export default NavigationContainer
