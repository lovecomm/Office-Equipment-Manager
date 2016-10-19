import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { title, menuItems, menuItemsDesktop, appBar } from './styles.scss'
import { container } from 'sharedStyles/layout'

function MenuItems (props) {
	if (props.isAuthed) {
		if (window.outerWidth <= 900) { // dropdown/mobile menu
			return (<IconMenu className={menuItems} icon='reorder' menuRipple={true}>
				<MenuItem caption={'Items'}
					onClick={() => {
						props.router.push('/')
						props.changeActiveView('/')
					}}
					className={(() => props.activeView === '/' ? 'active' : '')()} icon='view_agenda' />
				<MenuItem caption={'People'}
					onClick={() => {
						props.router.push('/people')
						props.changeActiveView('/people')
					}}
					className={(() => props.activeView === '/people' ? 'active' : '')()} icon='people' />
				<MenuItem caption={'Hardware'}
					onClick={() => {
						props.router.push('/hardware')
						props.changeActiveView('/hardware')
					}}
					className={(() => props.activeView === '/hardware' ? 'active' : '')()} icon='laptop' />
				<MenuDivider />
				<MenuItem icon='close' caption={'Sign Out'}
					onClick={() => props.router.push('/logout')} />
			</IconMenu>)
		} else { // desktop menu
			return (<div className={menuItemsDesktop}>
				<MenuItem caption={'Items'}
					onClick={() => {
						props.router.push('/')
						props.changeActiveView('/')
					}}
					className={(() => props.activeView === '/' ? 'active' : '')()}/>
				<MenuItem caption={'People'}
					onClick={() => {
						props.router.push('/people')
						props.changeActiveView('/people')
					}}
					className={(() => props.activeView === '/people' ? 'active' : '')()}/>
				<MenuItem caption={'Hardware'}
					onClick={() => {
						props.router.push('/hardware')
						props.changeActiveView('/hardware')
					}}
					className={(() => props.activeView === '/hardware' ? 'active' : '')()}/>
				<MenuItem caption={'Sign Out'}
					onClick={() => props.router.push('/logout')} />
			</div>)
		}
	} else {
		return <span></span>
	}
}

export default function Navigation (props, context) {
	return (
		<AppBar className={appBar}>
			<div className={container}>
				<Link to='/' className={title}>{'Equipment Manager'}</Link>
				<MenuItems {...props} router={context.router} />
			</div>
		</AppBar>
	)
}

Navigation.propTypes = {
	isAuthed: PropTypes.bool.isRequired,
	changeSortOrder: PropTypes.func.isRequired,
	sortFeedCreationDate: PropTypes.func.isRequired,
	sortFeedPurchaseDate: PropTypes.func.isRequired,
	sortFeedLastName: PropTypes.func.isRequired,
	sortFeedFirstName: PropTypes.func.isRequired,
	sortFeedHardware: PropTypes.func.isRequired,
	changeActiveView: PropTypes.func.isRequired,
	activeView: PropTypes.string.isRequired,
}

MenuItems.propTypes = {
	...Navigation.propTypes,
	router: PropTypes.object.isRequired,
}

Navigation.contextTypes = {
	router: PropTypes.object.isRequired,
}
