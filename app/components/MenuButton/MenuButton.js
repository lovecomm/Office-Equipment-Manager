import React, { PropTypes } from 'react'
import { FloatingActionButton, IconMenu, MenuItem } from 'material-ui'
import HardwareIcon from 'material-ui/svg-icons/hardware/laptop-chromebook'
import ContactsIcon from 'material-ui/svg-icons/communication/contacts'
import ContentAdd from 'material-ui/svg-icons/content/add'
import StreamIcon from 'material-ui/svg-icons/action/view-stream'
import { button } from './styles.css'
import { ModalHardwareContainer } from 'containers'

const MenuButton = React.createClass({
	propTypes: {
		isAuthed: PropTypes.bool.isRequired,
	},
	render () {
		return this.props.isAuthed === true
		? (
			<div>
				<IconMenu
					className={button}
					iconButtonElement={<FloatingActionButton><ContentAdd /></FloatingActionButton>}
					targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
					anchorOrigin={{horizontal: 'left', vertical: 'top'}} >
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
				</IconMenu>
			</div>
			)
		: null
	},
})

export default MenuButton
