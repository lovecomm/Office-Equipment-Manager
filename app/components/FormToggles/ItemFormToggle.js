import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

ItemFormToggle.propTypes = {
	editing: PropTypes.bool.isRequired,
	handleOpenForm: PropTypes.func.isRequired,
}

export default function ItemFormToggle ({handleOpenForm, editing}) {
	return (
		<MenuItem icon={(() => editing ? 'mode_edit' : 'view_agenda')()} onClick={handleOpenForm}
			caption={(() => editing ? 'Edit' : 'Item')()}/>
	)
}
