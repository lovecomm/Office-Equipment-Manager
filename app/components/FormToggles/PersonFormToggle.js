import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

PersonFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	editing: PropTypes.bool.isRequired,
	person: PropTypes.any.isRequired,
}

export default function PersonFormToggle ({handleOpenEditForm, person, editing}) {
	return (
		<MenuItem icon='people' onClick={handleOpenEditForm}
			caption={(() => editing ? `Edit ${person.firstName} ${person.lastName}` : 'New Person')()}/>
	)
}
