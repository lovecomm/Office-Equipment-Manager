import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

ItemsEditFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	serial: PropTypes.string.isRequired,
}

export default function ItemsEditFormToggle ({handleOpenEditForm, serial}) {
	return (
		<MenuItem icon='view_agenda' onClick={handleOpenEditForm} caption={(() => `Edit ${serial}`)()} />
	)
}
