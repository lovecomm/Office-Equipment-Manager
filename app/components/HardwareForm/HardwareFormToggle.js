import React, { PropTypes } from 'react'

HardwareFormToggle.propTypes = {
	openHardwareForm: PropTypes.func.isRequired,
}

export default function HardwareFormToggle ({openHardwareForm}) {
	return (
		<span onTouchTap={openHardwareForm}>{'Add Hardware'}</span>
	)
}
