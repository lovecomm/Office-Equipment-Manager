import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

HardwareFormToggle.propTypes = {
	openHardwareForm: PropTypes.func.isRequired,
}

export default function HardwareFormToggle ({openHardwareForm}) {
	return (
		<MenuItem icon='laptop' onClick={openHardwareForm} caption='Add Hardware'/>
	)
}
