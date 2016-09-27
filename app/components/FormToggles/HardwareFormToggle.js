import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

HardwareFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	editing: PropTypes.bool.isRequired,
	hardware: PropTypes.any.isRequired,
}

export default function HardwareFormToggle ({handleOpenEditForm, hardware, editing}) {
	return (
		<MenuItem icon='laptop' onClick={handleOpenEditForm}
			caption={(() => editing ? `Edit ${hardware.make} ${hardware.model}` : 'New Hardware')()}/>
	)
}
