import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import FontIcon from 'react-toolbox/lib/font_icon'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { title, dropdownIcon, dropdownMenu, container, signout } from './styles.scss'
import { HardwareFormToggleContainer, PersonFormToggleContainer, ItemFormToggleContainer } from 'containers'

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
			<ItemFormToggleContainer editing={false} itemId='' serial=''/>
			<PersonFormToggleContainer editing={false}/>
			<HardwareFormToggleContainer editing={false}/>
			<MenuDivider />
			<Link to='/logout'><MenuItem icon='close' value='Sign Out' caption='Sign Out' /></Link>
		</IconMenu>)
	} else {
		return <Link className={signout} to='/auth'><MenuItem className={signout} value='Sign In' caption='Sign In' /></Link>
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
