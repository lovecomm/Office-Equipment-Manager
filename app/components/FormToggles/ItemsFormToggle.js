import React, { PropTypes } from 'react'
import { MenuItem } from 'react-toolbox/lib/menu'

ItemsFormToggle.propTypes = {
	openItemsForm: PropTypes.func.isRequired,
}

export default function ItemsFormToggle ({openItemsForm}) {
	return (
		<MenuItem icon='view_agenda' onClick={openItemsForm} caption='Add Items'/>
	)
}
