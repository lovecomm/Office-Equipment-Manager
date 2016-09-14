import React from 'react'
import HardwareFormContainer from './HardwareFormContainer'
import PersonFormContainer from './PersonFormContainer'
import ItemsFormContainer from './ItemsFormContainer'
import ItemsEditFormContainer from './ItemsEditFormContainer'

export default function FormsDrawersContainer (props) {
	return (
		<div>
			<ItemsFormContainer />
			<ItemsEditFormContainer />
			<HardwareFormContainer />
			<PersonFormContainer />
		</div>
	)
}
