import React, { PropTypes } from 'react'
import { Drawer, Input, Button, DatePicker, Autocomplete } from 'react-toolbox/lib'
import { button, headline, formWrapper, drawer, imageInput, selectedPhoto, error } from './styles.scss'

const	{ func, bool, object, string, any } = PropTypes

ItemForm.propTypes = {
	itemId: string.isRequired,
	isOpen: bool.isRequired,
	purchasedDate: any.isRequired,
	serial: string.isRequired,
	person: string.isRequired,
	personId: string,
	hardware: string.isRequired,
	hardwareId: string,
	note: string.isRequired,
	photo: object.isRequired,
	photoName: string.isRequired,
	people: object.isRequired,
	editing: bool.isRequired,
	error: string.isRequired,
	// START Bound to dispatch
	closeItemForm: func.isRequired,
	updateItemFormSerial: func.isRequired,
	updateItemFormPurchasedDate: func.isRequired,
	updateItemFormNote: func.isRequired,
	updateItemFormPhoto: func.isRequired,
	updateItemFormPersonInfo: func.isRequired,
	updateItemFormHardwareInfo: func.isRequired,
	newItemFanout: func.isRequired,
	updateItemFanout: func.isRequired,
	// END Bound to dispatch
	isSubmitDisabled: bool.isRequired,
}

export default function ItemForm (props, context) {
	function formatPeopleList () {
		let peopleList = {}
		Object.keys(props.people).forEach((person) => {
			const thisPerson = props.people[person]
			peopleList = {
				...peopleList,
				[person]: `${thisPerson.firstName} ${thisPerson.lastName}`,
			}
		})
		return peopleList
	}
	function formatHardwareList () {
		let hardwareList = {}
		Object.keys(props.hardwares).forEach((hardwareId) => {
			let hardware = props.hardwares[hardwareId]
			hardwareList = {
				...hardwareList,
				[hardwareId]: `${hardware.make} ${hardware.model}`,
			}
		})
		return hardwareList
	}
	function submitItems () {
		const item = {
			itemId: props.itemId,
			purchasedDate: props.purchasedDate,
			serial: props.serial,
			personId: props.personId,
			person: props.person,
			hardwareId: props.hardwareId,
			hardware: props.hardware,
			note: props.note,
			photo: props.photo,
			photoName: props.photoName,
		}
		props.editing === false
		? props.newItemFanout(item)
		: props.updateItemFanout(item)
	}
	return (
		<Drawer active={props.isOpen}
			className={drawer}
			onOverlayClick={props.closeItemForm}>
			<div className={headline}>
				{props.editing === false
					? 'New Item'
					: `Editing Item ${props.serial}`}
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(value) => props.updateItemFormSerial(value)}
					label='Serial #'
					value={props.serial}
					required={true}/>
				<br />
				<Autocomplete
					required={true}
					multiple={false}
					direction='down'
					selectedPosition='above'
					label='Assign item to:'
					onChange={(value) => props.updateItemFormPersonInfo(value)}
					source={formatPeopleList()}
					value={props.person} />
					<Autocomplete
						required={true}
						multiple={false}
						direction='down'
						selectedPosition='above'
						label='This is what kind of hardware?'
						onChange={(value) => props.updateItemFormHardwareInfo(value)}
						source={formatHardwareList()}
						value={props.hardware} />
				<br />
				<DatePicker
					label='When was the item purchased?'
					autoOk={true}
					value={props.purchasedDate}
					onChange={(value) => props.updateItemFormPurchasedDate(value)}
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateItemFormNote(value)}
					label='Add note to this item?'
					value={props.note}
					multiline={true}
					required={false}/>
				<br />
				<div className={button}>
					<Button
						raised={true}
						label={(() => {
							if (props.editing && props.photoName !== '') { // I'm testing for photoName here, because I'm loading the photoName into the form when the item is being edited, not the original photo object itself.
								return 'Change Photo?'
							} else {
								return 'Add Photo?'
							}
						})()}
						primary={true} />
					<input type='file' onChange={(e) => props.updateItemFormPhoto(e.target.files[0])} className={imageInput}/>
				</div>
				<br />
				{props.photoName !== ''
					? <p className={selectedPhoto}>{props.photoName}</p>
					: ''}
				<br />
				<Button label={(() => props.editing
					? 'Update'
					: 'Add Item')()}
					type='submit' raised={true}
					accent={true}
					primary={false}
					onClick={submitItems}
					disabled={props.isSubmitDisabled}
					className={button} />
				<span className={error}>{props.error}</span>
			</div>
		</Drawer>
	)
}
