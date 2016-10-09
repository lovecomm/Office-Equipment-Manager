import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

HardwareFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	editing: PropTypes.bool.isRequired,
	hardware: PropTypes.any.isRequired,
}

export default function HardwareFormToggle ({handleOpenEditForm, hardware, editing}) {
	return (
		<MenuItem icon={(() => editing ? 'mode_edit' : 'laptop')()} onClick={handleOpenEditForm}
			caption={(() => editing ? `${hardware.make} ${hardware.model}` : 'Hardware')()}/>
	)
}
