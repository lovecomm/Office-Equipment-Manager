import React, { PropTypes } from 'react'
import { toggle } from './styles.css'

HardwareFormToggle.propTypes = {
	openHardwareForm: PropTypes.func.isRequired,
}

export default function HardwareFormToggle ({openHardwareForm}) {
	return (
		<span onTouchTap={openHardwareForm} className={toggle}>{'Add Hardware'}</span>
	)
}
