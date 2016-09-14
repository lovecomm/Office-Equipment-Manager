import React from 'react'
import HardwareFormContainer from './HardwareFormContainer'
import PersonFormContainer from './PersonFormContainer'
import ItemFormContainer from './ItemFormContainer'

export default function FormsDrawersContainer (props) {
	return (
		<div>
			<ItemFormContainer />
			<HardwareFormContainer />
			<PersonFormContainer />
		</div>
	)
}
