import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

PersonFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	person: PropTypes.any.isRequired,
}

export default function PersonFormToggle ({handleOpenEditForm, person}) {
	return (
		<MenuItem icon='people' onClick={handleOpenEditForm}
			caption={(() => person === '' ? 'New Person' : `Edit ${person.firstName} ${person.lastName}`)()}/>
	)
}
