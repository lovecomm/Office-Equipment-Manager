import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

PeopleEditFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	person: PropTypes.object.isRequired,
}

export default function PeopleEditFormToggle ({handleOpenEditForm, person}) {
	return (
		<MenuItem icon='people' onClick={handleOpenEditForm} caption={(() => `Edit ${person.firstName} ${person.lastName}`)()}/>
	)
}
