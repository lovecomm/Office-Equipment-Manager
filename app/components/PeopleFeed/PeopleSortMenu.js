import React, { PropTypes } from 'react'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { sortWrapperIcon, sortWrapper } from 'sharedStyles/actionBar.scss'

PeopleSortMenu.propTypes = {
	changeSortOrder: PropTypes.func.isRequired,
	sortPeopleFeedBy: PropTypes.func.isRequired,
}

export default function PeopleSortMenu (props) {
	return (<IconMenu
		icon={<span
			className={sortWrapperIcon}><MenuItem>{'Sort'}</MenuItem><MenuItem icon='sort' /></span>}
		position='topRight'
		className={sortWrapper}
		iconRipple={false}>
		<MenuItem icon='cached' caption='Reverse Sort Order' onClick={props.changeSortOrder}/>
		<MenuDivider />
		<MenuItem icon='event' caption='Date Created' onClick={() => props.sortPeopleFeedBy('dateCreated')}/>
		<MenuItem icon='first_page' caption='First Name' onClick={() => props.sortPeopleFeedBy('firstName')}/>
		<MenuItem icon='last_page' caption='Last Name' onClick={() => props.sortPeopleFeedBy('lastName')}/>
	</IconMenu>)
}
