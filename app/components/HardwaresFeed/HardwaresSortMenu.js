import React, { PropTypes } from 'react'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { sortWrapperIcon, sortWrapper } from 'sharedStyles/actionBar.scss'

HardwaresSortMenu.propTypes = {
	reverseHardwaresSortOrder: PropTypes.func.isRequired,
	sortHardwaresFeedBy: PropTypes.func.isRequired,
}

export default function HardwaresSortMenu (props) {
	return (<IconMenu
		icon={<span
			className={sortWrapperIcon}><MenuItem>{'Sort'}</MenuItem><MenuItem icon='sort' /></span>}
		position='topRight'
		className={sortWrapper}
		iconRipple={false}>
		<MenuItem icon='cached' caption='Reverse Sort Order' onClick={props.reverseHardwaresSortOrder}/>
		<MenuDivider />
		<MenuItem icon='event' caption='Date Created' onClick={() => props.sortHardwaresFeedBy('dateCreated')}/>
		<MenuItem icon='devices_other' caption='Make' onClick={() => props.sortHardwaresFeedBy('make')}/>
		<MenuItem icon='tv' caption='Model' onClick={() => props.sortHardwaresFeedBy('model')}/>
	</IconMenu>)
}
