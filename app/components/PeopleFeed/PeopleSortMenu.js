import React, { PropTypes } from 'react'
import { MenuItem, MenuDivider } from 'react-toolbox/lib/menu'

export default function PeopleSortMenu (props) {
	return (<div>
		<MenuItem icon='cached' caption='Reverse Sort Order' onClick={props.changeSortOrder}/>
		<MenuDivider />
		<MenuItem icon='event' caption='Date Created' onClick={props.sortFeedCreationDate}/>
		<MenuItem icon='first_page' caption='First Name' onClick={props.sortFeedFirstName}/>
		<MenuItem icon='last_page' caption='Last Name' onClick={props.sortFeedLastName}/>
	</div>)
}
