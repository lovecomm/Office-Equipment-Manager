import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwareActionCreators from 'redux/modules/hardwareForm'
import { HardwareFormToggle } from 'components'

const HardwareFormToggleContainer = React.createClass({
	propTypes: {
		hardwareId: PropTypes.string, // only going to be getting a make if the user is editing a hardware, not if they are creating a new one.
		editing: PropTypes.bool.isRequired,
		openHardwareForm: PropTypes.func.isRequired,
		initiateHardwareForm: PropTypes.func.isRequired,
	},
	handleOpenEditForm () {
		if (this.props.editing) {
			this.props.initiateHardwareForm(this.props.hardwareId)
		} else {
			this.props.openHardwareForm()
		}
	},
	render () {
		return (
			<HardwareFormToggle
				handleOpenEditForm={this.handleOpenEditForm}
				editing={this.props.editing} />
		)
	},
})

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(HardwareFormToggleContainer)
