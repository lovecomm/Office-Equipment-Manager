import React, { PropTypes } from 'react'
import { toolbar, toolbarWrapper, filterWrapper, sortWrapper, sortWrapperIcon, newWrapper } from './styles.scss'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'

ActionBar.propTypes = {
	newFormToggle: PropTypes.object.isRequired,
	filter: PropTypes.object.isRequired,
	sortMenu: PropTypes.object.isRequired,
}

export default function ActionBar (props) {
	return (
		<div className={toolbarWrapper}>
			<div className={toolbar}>
				<div className={newWrapper}>{props.newFormToggle}</div>
				<div className={filterWrapper}>{props.filter}</div>
				<IconMenu
					icon={<span
						className={sortWrapperIcon}><MenuItem>{'Sort'}</MenuItem><MenuItem icon='sort' /></span>}
					position='topRight'
					className={sortWrapper}
					iconRipple={false}>
					{props.sortMenu}
				</IconMenu>
			</div>
		</div>
	)
}
