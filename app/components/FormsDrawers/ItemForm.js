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
	updateSerial: func.isRequired,
	updatePurchasedDate: func.isRequired,
	updateNote: func.isRequired,
	updatePhoto: func.isRequired,
	updatePersonInfo: func.isRequired,
	updateHardwareInfo: func.isRequired,
	itemFanout: func.isRequired,
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
		props.itemFanout({
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
			editing: props.editing,
		})
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
					onChange={(value) => props.updateSerial(value)}
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
					onChange={(value) => props.updatePersonInfo(value)}
					source={formatPeopleList()}
					value={props.person} />
					<Autocomplete
						required={true}
						multiple={false}
						direction='down'
						selectedPosition='above'
						label='This is what kind of hardware?'
						onChange={(value) => props.updateHardwareInfo(value)}
						source={formatHardwareList()}
						value={props.hardware} />
				<br />
				<DatePicker
					label='When was the item purchased?'
					autoOk={true}
					value={props.purchasedDate}
					onChange={(value) => props.updatePurchasedDate(value)}
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateNote(value)}
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
					<input type='file' onChange={(e) => props.updatePhoto(e.target.files[0])} className={imageInput}/>
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
