import React, { PropTypes } from 'react'
import { editMenu } from './styles.scss'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { ItemFormToggleContainer, PersonFormToggleContainer, HardwareFormToggleContainer } from 'containers'

EditMenu.propTypes = {
	type: PropTypes.string.isRequired,
	itemId: PropTypes.string,
	serial: PropTypes.string,
	person: PropTypes.object,
	hardware: PropTypes.object,
	handleDeletion: PropTypes.func.isRequired,
}

export default function EditMenu (props) {
	switch (props.type) {
	case 'item':
		return (
			<IconMenu icon='settings' position='auto' menuRipple={true}
				className={editMenu}>
				<ItemFormToggleContainer itemId={props.itemId} editing={true}/>
				<MenuItem icon='delete' caption='Delete' onClick={() => props.handleDeletion('items', props.itemId)}/>
			</IconMenu>
		)
	case 'person':
		return (
			<IconMenu icon='settings' position='auto' menuRipple={true}
				className={editMenu}>
				<PersonFormToggleContainer person={props.person} editing={true}/>
				<MenuItem icon='delete' caption='Delete' onClick={() => props.handleDeletion('people', props.person.personId)}/>
			</IconMenu>
		)
	case 'hardware':
		return (
			<IconMenu icon='settings' position='auto' menuRipple={true}
				className={editMenu}>
				<HardwareFormToggleContainer editing={true} hardware={props.hardware}/>
				<MenuItem icon='delete' caption='Delete' onClick={() => props.handleDeletion('hardwares', props.hardware.hardwareId)}/>
			</IconMenu>
		)
	default:
		return (<div></div>)
	}
}
