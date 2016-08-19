import React from 'react'
import HardwareFormContainer from './HardwareFormContainer'
import PeopleFormContainer from './PeopleFormContainer'
import ItemsFormContainer from './ItemsFormContainer'

export default function FormsDrawersContainer (props) {
	return (
		<div>
			<ItemsFormContainer />
			<HardwareFormContainer />
			<PeopleFormContainer />
		</div>
	)
}
