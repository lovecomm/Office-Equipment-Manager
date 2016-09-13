import React, { PropTypes } from 'react'
import { editMenu } from './styles.scss'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { ItemsEditFormToggleContainer } from 'containers'

EditMenu.propTypes = {
	itemId: PropTypes.string.isRequired,
	serial: PropTypes.string.isRequired,
	itemPerson: PropTypes.object.isRequired,
	itemHardware: PropTypes.object.isRequired,
}

export default function EditMenu (props) {
	return (
		<IconMenu icon='settings' position='auto' menuRipple={true}
			className={editMenu}>
			<ItemsEditFormToggleContainer itemId={props.itemId} serial={props.serial}/>
			<MenuDivider />
			<MenuItem icon='delete' caption={(() => `Delete ${props.serial}`)()} />
			<MenuItem icon='delete' caption={(() => `Delete ${props.itemPerson.firstName} ${props.itemPerson.lastName}`)()} />
			<MenuItem icon='delete' caption={(() => `Delete ${props.itemHardware.make} ${props.itemHardware.model}`)()} />
		</IconMenu>
	)
}
