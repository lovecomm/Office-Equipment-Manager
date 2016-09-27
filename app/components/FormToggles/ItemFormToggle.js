import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

ItemFormToggle.propTypes = {
	serial: PropTypes.string.isRequired,
	editing: PropTypes.bool.isRequired,
	handleOpenForm: PropTypes.func.isRequired,
}

export default function ItemFormToggle ({handleOpenForm, editing, serial}) {
	return (
		<MenuItem icon='view_agenda' onClick={handleOpenForm}
			caption={(() => editing ? `Edit ${serial}` : 'New Item')()}/>
	)
}