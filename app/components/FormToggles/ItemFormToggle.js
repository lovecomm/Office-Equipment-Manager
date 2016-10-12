import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'
import { Button } from 'react-toolbox/lib'

ItemFormToggle.propTypes = {
	editing: PropTypes.bool.isRequired,
	handleOpenForm: PropTypes.func.isRequired,
}

export default function ItemFormToggle ({handleOpenForm, editing}) {
	if (editing) {
		return (<Button label='Edit' onClick={handleOpenForm} />)
	} else {
		return (<MenuItem icon='view_agenda' onClick={handleOpenForm} caption='Item'/>)
	}
}
