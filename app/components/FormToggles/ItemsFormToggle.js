import React, { PropTypes } from 'react'
import { toggle } from './styles.css'

ItemsFormToggle.propTypes = {
	openItemsForm: PropTypes.func.isRequired,
}

export default function ItemsFormToggle ({openItemsForm}) {
	return (
		<span onTouchTap={openItemsForm} className={toggle}>{'Add Items'}</span>
	)
}
