import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { AppBar, IconMenu, MenuItem, IconButton } from 'material-ui'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import ContactsIcon from 'material-ui/svg-icons/communication/contacts'
import StreamIcon from 'material-ui/svg-icons/action/view-stream'
import HardwareIcon from 'material-ui/svg-icons/hardware/laptop-chromebook'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { dropdownLink, title } from './styles.css'
import { FormTogglesContainer } from 'containers'

 Navigation.propTypes = NavItems.propTypes = MenuItems.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
}

function NavItems ({isAuthed}) {
	return isAuthed === true
	? <div>
			<Link to='/hardware'><IconButton><HardwareIcon color='white'/></IconButton></Link>
			<Link to='/people'><IconButton><ContactsIcon color='white'/></IconButton></Link>
			<Link to='/'><IconButton><StreamIcon color='white'/></IconButton></Link>
			<IconMenu
				iconButtonElement={<IconButton><ContentAdd color='white'/></IconButton>}
				targetOrigin={{horizontal: 'left', vertical: 'top'}}
				anchorOrigin={{horizontal: 'left', vertical: 'bottom'}} >
					<FormTogglesContainer />
				</IconMenu>
		</div>
	: <span></span>
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
				targetOrigin={{horizontal: 'left', vertical: 'top'}}
				anchorOrigin={{horizontal: 'left', vertical: 'bottom'}} >
					<MenuItems isAuthed={isAuthed} />
				</IconMenu>}
				iconElementRight={<NavItems isAuthed={isAuthed} />} />
	)
}
