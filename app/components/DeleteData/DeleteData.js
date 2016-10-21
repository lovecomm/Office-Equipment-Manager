import React, { PropTypes } from 'react'
import { Button } from 'react-toolbox/lib'
import { Snackbar } from 'react-toolbox'

DeleteData.propTypes = {
	type: PropTypes.string.isRequired,
	itemId: PropTypes.string,
	serial: PropTypes.string,
	person: PropTypes.object,
	hardware: PropTypes.object,
	handleDeletion: PropTypes.func.isRequired,
	handleConfirmDeleteTimeout: PropTypes.func.isRequired,
	handleDeleteData: PropTypes.func.isRequired,
	confirmDeleteActive: PropTypes.bool.isRequired,
	toDeleteType: PropTypes.string.isRequired,
	toDeleteId: PropTypes.string.isRequired,
}

export default function DeleteData (props) {
	return (
		<div>
			{(() => {
				switch (props.type) {
				case 'item':
					return (
						<Button icon='delete' onClick={() => props.handleDeletion('items', props.itemId)} />
					)
				case 'person':
					return (
						<Button icon='delete' onClick={() => props.handleDeletion('people', props.person.personId)} />
					)
				case 'hardware':
					return (
						<Button icon='delete' onClick={() => props.handleDeletion('hardwares', props.hardware.hardwareId)} />
					)
				default:
					return (<div></div>)
				}
			})()}
			<Snackbar
				action='delete'
				active={props.confirmDeleteActive}
				icon='delete'
				timeout={10000}
				onTimeout={props.handleConfirmDeleteTimeout}
				onClick={props.handleDeleteData}
				label={(() => {
					switch (props.toDeleteType) {
					case 'people':
						return 'Are you sure you want to delete this person? If you do, ALL ITEMS assigned to this person will be assigned to INVENTORY. There is no taking back this action.'
					case 'hardwares':
						return 'Are you sure you want to delete this hardware? If you do, ALL ITEMS using this hardware will be deleted. There is no taking back this action.'
					default:
						return 'Are you sure you want to delete this item? There is no taking back this action.'
					}
				})()}
				type='cancel' />
		</div>
	)
}
