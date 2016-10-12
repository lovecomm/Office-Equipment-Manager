import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

PersonFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	editing: PropTypes.bool.isRequired,
}

export default function PersonFormToggle ({handleOpenEditForm, editing}) {
	return (
		<MenuItem icon={(() => editing ? 'mode_edit' : 'people')()} onClick={handleOpenEditForm}
			caption={(() => editing ? 'Edit' : 'Person')()}/>
	)
}
