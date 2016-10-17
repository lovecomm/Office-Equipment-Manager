import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { title, dropdownMenu, menuItems } from './styles.scss'
import { HardwareFormToggleContainer, PersonFormToggleContainer, ItemFormToggleContainer } from 'containers'
import { container } from 'sharedStyles/layout'

 Navigation.propTypes = MenuItems.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
	activeCards: PropTypes.string.isRequired,
	changeActiveCards: PropTypes.func.isRequired,
	changeSortOrder: PropTypes.func.isRequired,
	sortFeedCreationDate: PropTypes.func.isRequired,
	sortFeedPurchaseDate: PropTypes.func.isRequired,
	sortFeedLastName: PropTypes.func.isRequired,
	sortFeedFirstName: PropTypes.func.isRequired,
	sortFeedHardware: PropTypes.func.isRequired,
}

function MenuItems (props) {
	if (props.isAuthed) {
		return (<IconMenu className={menuItems} icon='reorder' menuRipple={true}>
			<MenuItem onClick={(() => props.changeActiveCards('items'))} className={(() => props.activeCards === 'items' ? 'active' : '')()} icon='view_agenda'>{'Items'}</MenuItem>
			<MenuItem onClick={(() => props.changeActiveCards('people'))} className={(() => props.activeCards === 'people' ? 'active' : '')()} icon='people'>{'People'}</MenuItem>
			<MenuItem onClick={(() => props.changeActiveCards('hardware'))} className={(() => props.activeCards === 'hardware' ? 'active' : '')()} icon='laptop'>{'Hardware'}</MenuItem>
			<MenuDivider />
			<MenuItem icon='close'><Link to='/logout'>{'Sign Out'}</Link></MenuItem>
		</IconMenu>)
	} else {
		return <span></span>
	}
}

export default function Navigation (props) {
	return (
		<AppBar>
			<div className={container}>
				<Link to='/' className={title}>{'Equipment Manager'}</Link>
				<MenuItems {...props} />
			</div>
		</AppBar>
	)
}
