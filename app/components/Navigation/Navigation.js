import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { AppBar, IconMenu, MenuItem, IconButton, Menu } from 'material-ui'
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import ContactsIcon from 'material-ui/svg-icons/communication/contacts'
import StreamIcon from 'material-ui/svg-icons/action/view-stream'
import ContentAdd from 'material-ui/svg-icons/content/add'
import HardwareIcon from 'material-ui/svg-icons/hardware/laptop-chromebook'
import { dropdownLink, title } from './styles.css'
import { ModalHardwareContainer } from 'containers'

MenuItems.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
}

Navigation.propTypes = NavItems.propTypes = {
	...MenuItems.propTypes,
	handleRequestClose: PropTypes.func.isRequired,
	handleTouchTap: PropTypes.func.isRequired,
	anchorEl: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
}

function NavItems ({isAuthed, handleRequestClose, handleTouchTap, open, anchorEl}) {
	return isAuthed === true
	? <div>
			<Link to='/'><IconButton><HardwareIcon color='white'/></IconButton></Link>
			<Link to='/'><IconButton><ContactsIcon color='white'/></IconButton></Link>
			<Link to='/'><IconButton><StreamIcon color='white'/></IconButton></Link>
			<IconButton onTouchTap={handleTouchTap}>
				<ContentAdd color='white'/>
				<Popover
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
					targetOrigin={{horizontal: 'left', vertical: 'top'}}
					onRequestClose={handleRequestClose}
					animation={PopoverAnimationVertical}>
					<Menu>
						<MenuItem
							leftIcon={<HardwareIcon />}>
							<span><ModalHardwareContainer /></span>
						</MenuItem>
						<MenuItem
							primaryText='Add People'
							leftIcon={<ContactsIcon />} />
						<MenuItem
							primaryText='Add Item'
							leftIcon={<StreamIcon />} />
					</Menu>
				</Popover>
			</IconButton>
		</div>
	: <span></span>
}

function MenuItems ({isAuthed}) {
	return isAuthed === true
	? <Link to='/logout' className={dropdownLink}><MenuItem primaryText='Sign out' /></Link>
	: <Link to='/auth' className={dropdownLink}><MenuItem primaryText='Sign in' /></Link>
}

export default function Navigation ({isAuthed, handleTouchTap, handleRequestClose, anchorEl, open}) {
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
				iconElementRight={<NavItems
					isAuthed={isAuthed}
					handleRequestClose={handleRequestClose}
					handleTouchTap={handleTouchTap}
					anchorEl={anchorEl}
					open={open}/>} />
	)
}
