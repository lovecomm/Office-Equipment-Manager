import React from 'react'
import { MenuItem } from 'material-ui'
import HardwareFormToggleContainer from './HardwareFormToggleContainer'
import PeopleFormToggleContainer from './PeopleFormToggleContainer'
import ItemsFormToggleContainer from './ItemsFormToggleContainer'

export default function FormTogglesContainer (props) {
	return (
		<div>
			<MenuItem style={{textAlign: 'right'}}><ItemsFormToggleContainer /></MenuItem>
			<MenuItem style={{textAlign: 'right'}}><PeopleFormToggleContainer /></MenuItem>
			<MenuItem style={{textAlign: 'right'}}><HardwareFormToggleContainer /></MenuItem>
		</div>
	)
}
