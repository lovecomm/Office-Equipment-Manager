import React, { PropTypes } from 'react'
import { Link } from 'react-router'
// import { AppBar, IconMenu, MenuItem, IconButton } from 'material-ui'
import { AppBar } from 'react-toolbox/lib/app_bar'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import { dropdownLink, title } from './styles.css'

//  Navigation.propTypes = MenuItems.propTypes = {
// 	isAuthed: PropTypes.bool.isRequired,
// }

// function MenuItems ({isAuthed}) {
// 	return isAuthed === true
// 	? <Link to='/logout' className={dropdownLink}><MenuItem primaryText='Sign out' /></Link>
// 	: <Link to='/auth' className={dropdownLink}><MenuItem primaryText='Sign in' /></Link>
// }

export default function Navigation ({isAuthed}) {
	return (
		// <AppBar
		// 	title='Equipment Manager'
		// 	className={title}
		// 	iconElementLeft={<IconMenu
		// 		iconButtonElement={<IconButton><MenuIcon color='white'/></IconButton>}
		// 		targetOrigin={{horizontal: 'left', vertical: 'top'}}
		// 		anchorOrigin={{horizontal: 'left', vertical: 'bottom'}} >
		// 			<MenuItems isAuthed={isAuthed} />
		// 		</IconMenu>}/>
		<AppBar fixed={true} flat={true}>
			<Link to='/' className={title}>Equipment Manager</Link>
		</AppBar>
	)
}
