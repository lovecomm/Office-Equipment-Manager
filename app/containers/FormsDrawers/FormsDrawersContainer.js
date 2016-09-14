import React from 'react'
import HardwareFormContainer from './HardwareFormContainer'
import PeopleFormContainer from './PeopleFormContainer'
import PeopleEditFormContainer from './PeopleEditFormContainer'
import ItemsFormContainer from './ItemsFormContainer'
import ItemsEditFormContainer from './ItemsEditFormContainer'

export default function FormsDrawersContainer (props) {
	return (
		<div>
			<ItemsFormContainer />
			<ItemsEditFormContainer />
			<HardwareFormContainer />
			<PeopleFormContainer />
			<PeopleEditFormContainer />
		</div>
	)
}
