import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { title, menuItems } from './styles.scss'
import { container } from 'sharedStyles/layout'

function MenuItems (props) {
	if (props.isAuthed) {
		return (<IconMenu className={menuItems} icon='reorder' menuRipple={true}>
			<MenuItem caption={'Items'}
				onClick={() => {
					props.router.push('/')
					props.changeActiveCards('items')
				}}
				className={(() => props.activeCards === 'items' ? 'active' : '')()} icon='view_agenda' />
			<MenuItem caption={'People'}
				onClick={() => {
					props.router.push('/people')
					props.changeActiveCards('people')
				}}
				className={(() => props.activeCards === 'people' ? 'active' : '')()} icon='people' />
			<MenuItem caption={'Hardware'}
				onClick={() => {
					props.router.push('/hardware')
					props.changeActiveCards('hardware')
				}}
				className={(() => props.activeCards === 'hardware' ? 'active' : '')()} icon='laptop' />
			<MenuDivider />
			<MenuItem icon='close' caption={'Sign Out'}
				onClick={() => props.router.push('/logout')} />
		</IconMenu>)
	} else {
		return <span></span>
	}
}

export default function Navigation (props, context) {
	return (
		<AppBar>
			<div className={container}>
				<Link to='/' className={title}>{'Equipment Manager'}</Link>
				<MenuItems {...props} router={context.router} />
			</div>
		</AppBar>
	)
}


Navigation.propTypes = MenuItems.propTypes = {
 isAuthed: PropTypes.bool.isRequired,
 changeSortOrder: PropTypes.func.isRequired,
 sortFeedCreationDate: PropTypes.func.isRequired,
 sortFeedPurchaseDate: PropTypes.func.isRequired,
 sortFeedLastName: PropTypes.func.isRequired,
 sortFeedFirstName: PropTypes.func.isRequired,
 sortFeedHardware: PropTypes.func.isRequired,
 changeActiveCards: PropTypes.func.isRequired,
 activeCards: PropTypes.string.isRequired,
}

Navigation.contextTypes = MenuItems.contextTypes = {
 router: PropTypes.object.isRequired,
}
