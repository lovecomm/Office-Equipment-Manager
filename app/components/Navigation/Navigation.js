import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { title, menuItems, menuItemsDesktop, appBar, controlMenu } from './styles.scss'
import { container } from 'sharedStyles/layout'

function MenuItems (props) {
	if (props.isAuthed) {
		if (window.matchMedia('(max-width: 900px)').matches) { // dropdown/mobile menu
			return (<IconMenu className={menuItems} icon='reorder' menuRipple={true}>
				<MenuItem caption={'Items'}
					onClick={() => props.router.push('/')}
					className={(() => props.activePath === '/' ? 'active' : '')()} icon='view_agenda' />
				<MenuItem caption={'People'}
					onClick={() => props.router.push('/people')}
					className={(() => props.activePath === '/people' ? 'active' : '')()} icon='people' />
				<MenuItem caption={'Hardware'}
					onClick={() => props.router.push('/hardware')}
					className={(() => props.activePath === '/hardware' ? 'active' : '')()} icon='laptop' />
				<MenuDivider />
				<MenuItem icon='close' caption={'Sign Out'}
					onClick={() => props.router.push('/logout')} />
			</IconMenu>)
		} else { // desktop menu
			return (<div className={menuItemsDesktop}>
				<MenuItem caption={'Items'}
					onClick={() => props.router.push('/')}
					className={(() => props.activePath === '/' ? 'active' : '')()}/>
				<MenuItem caption={'People'}
					onClick={() => props.router.push('/people')}
					className={(() => props.activePath === '/people' ? 'active' : '')()}/>
				<MenuItem caption={'Hardware'}
					onClick={() => props.router.push('/hardware')}
					className={(() => props.activePath === '/hardware' ? 'active' : '')()}/>
				<MenuItem caption={'Sign Out'}
					onClick={() => props.router.push('/logout')} />
			</div>)
		}
	} else {
		return <span></span>
	}
}

function ControlMenu (props) {
	if (props.isAuthed) {
		return (
			<IconMenu icon='more_vert' position='topLeft' menuRipple={true} className={controlMenu}>
		    <MenuItem value='import' icon='file_upload' caption='Import' onClick={() => props.toggleImportdataFormIsShowing()}/>
		    <MenuItem value='export' icon='file_download' caption='Export' onClick={() => console.log('exporting')}/>
		  </IconMenu>
		)
	} else {
		return <span></span>
	}
}

export default function Navigation (props, context) {
	return (
		<AppBar className={appBar}>
			<div className={container}>
				<div>
					<ControlMenu {...props} />
					<Link to='/' className={title}>{'Equipment Manager'}</Link>
				</div>
				<MenuItems {...props} router={context.router} />
			</div>
		</AppBar>
	)
}

Navigation.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
}

MenuItems.propTypes = {
	...Navigation.propTypes,
	router: PropTypes.object.isRequired,
}

Navigation.contextTypes = {
	router: PropTypes.object.isRequired,
}
