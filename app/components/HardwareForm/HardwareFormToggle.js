import React, { PropTypes } from 'react'

HardwareFormToggle.propTypes = {
	openHardwareFormAdd: PropTypes.func.isRequired,
}

export default function HardwareFormToggle (props, context) {
	return (
		<span onTouchTap={props.openHardwareFormAdd}>{'Add Hardware'}</span>
	)
}
