import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

PeopleFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	person: PropTypes.any.isRequired,
}

export default function PeopleFormToggle ({handleOpenEditForm, person}) {
	return (
		<MenuItem icon='people' onClick={handleOpenEditForm}
			caption={(() => person === '' ? 'New Person' : `Editing ${person.firstName} ${person.lastName}`)()}/>
	)
}
