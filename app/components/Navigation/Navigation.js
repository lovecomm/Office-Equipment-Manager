import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import FontIcon from 'react-toolbox/lib/font_icon'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { title, dropdownIcon, dropdownMenu, container } from './styles.scss'
import { HardwareFormToggleContainer, PeopleFormToggleContainer, ItemsFormToggleContainer } from 'containers'

 Navigation.propTypes = MenuItems.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
}

function MenuItems ({isAuthed}) {
	if (isAuthed) {
		return (<IconMenu
			className={dropdownMenu}
			icon={<FontIcon value='more_vert' className={dropdownIcon}/>}
			position='topRight'
			menuRipple={true}>
			<ItemsFormToggleContainer />
			<PeopleFormToggleContainer />
			<HardwareFormToggleContainer />
			<MenuDivider />
			<Link to='/logout'><MenuItem icon='close' value='Sign Out' caption='Sign Out' /></Link>
		</IconMenu>)
	} else {
		return <span></span>
	}
}

export default function Navigation ({isAuthed}) {
	return (
		<AppBar>
			<div className={container}>
				<Link to='/' className={title}>Equipment Manager</Link>
				<MenuItems isAuthed={isAuthed} />
			</div>
		</AppBar>
	)
}
