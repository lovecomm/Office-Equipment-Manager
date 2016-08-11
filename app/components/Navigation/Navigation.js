import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { AppBar, IconMenu, MenuItem, IconButton } from 'material-ui'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import ContactsIcon from 'material-ui/svg-icons/communication/contacts'
import StreamIcon from 'material-ui/svg-icons/action/view-stream'
import HardwareIcon from 'material-ui/svg-icons/hardware/laptop-chromebook'
import { dropdownLink, navLink, title } from './styles.css'

Navigation.propTypes = NavItems.propTypes = MenuItems.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
}

function NavItems ({isAuthed}) {
	return isAuthed === true
	? <div>
			<IconButton><Link to='/'><HardwareIcon color='white'/></Link></IconButton>
			<IconButton><Link to='/'><ContactsIcon color='white'/></Link></IconButton>
			<IconButton><Link to='/'><StreamIcon color='white'/></Link></IconButton>
		</div>
	: <Link to='/auth' className={navLink}><MenuItem primaryText='Sign in' style={{color: 'white'}}/></Link>
}

function MenuItems ({isAuthed}) {
	return isAuthed === true
	? <Link to='/logout' className={dropdownLink}><MenuItem primaryText='Sign out' /></Link>
	: <Link to='/auth' className={dropdownLink}><MenuItem primaryText='Sign in' /></Link>
}

export default function Navigation ({isAuthed}) {
	return (
		<AppBar
			title='Equipment Manager'
			className={title}
			iconElementLeft={<IconMenu
				iconButtonElement={<IconButton><MenuIcon color='white'/></IconButton>}
				targetOrigin={{horizontal: 'right', vertical: 'top'}}
				anchorOrigin={{horizontal: 'right', vertical: 'top'}} >
					<MenuItems isAuthed={isAuthed} />
				</IconMenu>}
				iconElementRight={<NavItems isAuthed={isAuthed} />} />
	)
}
