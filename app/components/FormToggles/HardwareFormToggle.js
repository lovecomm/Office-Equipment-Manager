import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

HardwareFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	editing: PropTypes.bool.isRequired,
}

export default function HardwareFormToggle ({handleOpenEditForm, editing}) {
	return (
		<MenuItem icon={(() => editing ? 'mode_edit' : 'laptop')()} onClick={handleOpenEditForm}
			caption={(() => editing ? 'Edit' : 'Hardware')()}/>
	)
}
