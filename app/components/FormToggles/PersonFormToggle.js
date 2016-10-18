import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'
import { Button } from 'react-toolbox/lib'

PersonFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	editing: PropTypes.bool.isRequired,
}

export default function PersonFormToggle ({handleOpenEditForm, editing}) {
	if (editing) {
		return (<Button icon='edit' onClick={handleOpenEditForm} />)
	} else {
		return (<MenuItem icon='add' onClick={handleOpenEditForm} caption='New Person'/>)
	}
}
