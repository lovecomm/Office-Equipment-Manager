import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'
import { Button } from 'react-toolbox/lib'

HardwareFormToggle.propTypes = {
	handleOpenEditForm: PropTypes.func.isRequired,
	editing: PropTypes.bool.isRequired,
}

export default function HardwareFormToggle ({handleOpenEditForm, editing}) {
	if (editing) {
		return (<Button label='Edit' accent={true} onClick={handleOpenEditForm} />)
	} else {
		return (<MenuItem icon='laptop' onClick={handleOpenEditForm} caption='Hardware'/>)
	}
}
