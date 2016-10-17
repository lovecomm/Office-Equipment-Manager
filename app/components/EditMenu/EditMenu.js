import React, { PropTypes } from 'react'
import { Button } from 'react-toolbox/lib'
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
			<div>
				<ItemFormToggleContainer itemId={props.itemId} editing={true}/>
				<Button icon='delete' onClick={() => props.handleDeletion('items', props.itemId)} />
			</div>
		)
	case 'person':
		return (
			<div>
				<PersonFormToggleContainer person={props.person} editing={true}/>
				<Button icon='delete' onClick={() => props.handleDeletion('people', props.person.personId)} />
			</div>
		)
	case 'hardware':
		return (
			<div>
				<HardwareFormToggleContainer editing={true} hardware={props.hardware}/>
				<Button icon='delete' onClick={() => props.handleDeletion('hardwares', props.hardware.hardwareId)} />
			</div>
		)
	default:
		return (<div></div>)
	}
}
