import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

PeopleFormToggle.propTypes = {
	openPeopleForm: PropTypes.func.isRequired,
}

export default function PeopleFormToggle ({openPeopleForm}) {
	return (
		<MenuItem icon='people' onClick={openPeopleForm} caption='Add Person'/>
	)
}
