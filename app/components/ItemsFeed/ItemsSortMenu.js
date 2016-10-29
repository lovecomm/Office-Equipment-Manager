import React, { PropTypes } from 'react'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { sortWrapperIcon, sortWrapper } from 'sharedStyles/actionBar.scss'

ItemsSortMenu.propTypes = {
	reverseItemsSortOrder: PropTypes.func.isRequired,
	sortItemsFeedBy: PropTypes.func.isRequired,
}

export default function ItemsSortMenu (props) {
	return (<IconMenu
		icon={<span
			className={sortWrapperIcon}><MenuItem>{'Sort'}</MenuItem><MenuItem icon='sort' /></span>}
		position='topRight'
		className={sortWrapper}
		iconRipple={false}>
		<MenuItem icon='sim_card' caption='Serial' onClick={() => props.sortItemsFeedBy('serial')}/>
		<MenuItem icon='monetization_on' caption='Date Purchased' onClick={() => props.sortItemsFeedBy('purchasedDate')}/>
		<MenuItem icon='event' caption='Date Created' onClick={() => props.sortItemsFeedBy('dateCreated')}/>
		<MenuDivider />
		<MenuItem icon='cached' caption='Reverse Sort Order' onClick={props.reverseItemsSortOrder}/>
	</IconMenu>)
}
