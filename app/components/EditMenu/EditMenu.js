import React, { PropTypes } from 'react'
import { editMenu } from './styles.scss'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { ItemFormToggleContainer, PersonFormToggleContainer } from 'containers'

EditMenu.propTypes = {
	itemId: PropTypes.string.isRequired,
	serial: PropTypes.string.isRequired,
	person: PropTypes.object.isRequired,
	hardware: PropTypes.object.isRequired,
}

export default function EditMenu (props) {
	return (
		<IconMenu icon='settings' position='auto' menuRipple={true}
			className={editMenu}>
			<ItemFormToggleContainer itemId={props.itemId} serial={props.serial} editing={true}/>
			<PersonFormToggleContainer person={props.person} editing={true}/>
			<MenuDivider />
			<MenuItem icon='delete' caption={(() => `Delete ${props.serial}`)()} />
			<MenuItem icon='delete' caption={(() => `Delete ${props.person.firstName} ${props.person.lastName}`)()} />
			<MenuItem icon='delete' caption={(() => `Delete ${props.hardware.make} ${props.hardware.model}`)()} />
		</IconMenu>
	)
}
