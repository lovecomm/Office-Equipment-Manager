import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { title, dropdownMenu, container, menuItems } from './styles.scss'
import { HardwareFormToggleContainer, PersonFormToggleContainer, ItemFormToggleContainer } from 'containers'

 Navigation.propTypes = MenuItems.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
	changeSortOrder: PropTypes.func.isRequired,
	sortFeedCreationDate: PropTypes.func.isRequired,
	sortFeedPurchaseDate: PropTypes.func.isRequired,
	sortFeedLastName: PropTypes.func.isRequired,
	sortFeedFirstName: PropTypes.func.isRequired,
	sortFeedHardware: PropTypes.func.isRequired,
}

function MenuItems (props) {
	if (props.isAuthed) {
		return (<div className={menuItems}>
			<MenuDivider />
			<IconMenu
				className={dropdownMenu}
				icon={<MenuItem>{'New'}</MenuItem>}
				position='topLeft'
				iconRipple={false}>
				<ItemFormToggleContainer editing={false} itemId='' serial=''/>
				<PersonFormToggleContainer editing={false}/>
				<HardwareFormToggleContainer editing={false}/>
			</IconMenu>
			<IconMenu
				icon={<MenuItem>{'Sort'}</MenuItem>}
				position='topLeft'
				iconRipple={false}>
				<MenuItem icon='cached' caption='Reverse Sort Order' onClick={props.changeSortOrder}/>
				<MenuDivider />
				<MenuItem icon='view_agenda' caption='Creation Date' onClick={props.sortFeedCreationDate}/>
				<MenuItem icon='monetization_on' caption='Purchase Date' onClick={props.sortFeedPurchaseDate}/>
				<MenuItem icon='people' caption='Last Name' onClick={props.sortFeedLastName}/>
				<MenuItem icon='people' caption='First Name' onClick={props.sortFeedFirstName}/>
				<MenuItem icon='laptop' caption='Make & Model' onClick={props.sortFeedHardware}/>
			</IconMenu>
			<MenuDivider />
			<Link to='/logout'>{'Sign Out'}</Link>
		</div>)
	} else {
		return <span></span>
	}
}

export default function Navigation (props) {
	return (
		<AppBar>
			<div className={container} style={{minHeight: window.innerHeight}}>
				<Link to='/' className={title}>{'Equipment'}<br />{'Manager'}</Link>
				<MenuItems {...props} />
			</div>
		</AppBar>
	)
}
