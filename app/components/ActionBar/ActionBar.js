import React, { PropTypes } from 'react'
import { toolbar, toolbarWrapper, newWrapper } from 'sharedStyles/actionBar.scss'

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
				{props.filter}
				{props.sortMenu}
			</div>
		</div>
	)
}
