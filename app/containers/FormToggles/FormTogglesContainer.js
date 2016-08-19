import React from 'react'
import { MenuItem } from 'material-ui'
import HardwareFormToggleContainer from './HardwareFormToggleContainer'
import PeopleFormToggleContainer from './PeopleFormToggleContainer'

export default function FormTogglesContainer (props) {
	return (
		<div>
			<MenuItem style={{textAlign: 'right'}}><PeopleFormToggleContainer /></MenuItem>
			<MenuItem style={{textAlign: 'right'}}><HardwareFormToggleContainer /></MenuItem>
		</div>
	)
}
