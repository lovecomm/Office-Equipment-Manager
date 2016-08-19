import React, { PropTypes } from 'react'
import { toggle } from './styles.css'

PeopleFormToggle.propTypes = {
	openPeopleForm: PropTypes.func.isRequired,
}

export default function PeopleFormToggle ({openPeopleForm}) {
	return (
		<span onTouchTap={openPeopleForm} className={toggle}>{'Add People'}</span>
	)
}
