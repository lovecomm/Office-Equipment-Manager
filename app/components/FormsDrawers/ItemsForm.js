import React, { PropTypes } from 'react'
import { Drawer, Input, Button, DatePicker, Autocomplete } from 'react-toolbox/lib'
import { button, headline, formWrapper, drawer, imageInput, selectedPhoto, error } from './styles.scss'
import { formatItem } from 'helpers/utils'

const	{ func, bool, object, string, any } = PropTypes

ItemsForm.propTypes = {
	isOpen: bool.isRequired,
	purchasedAtDate: any.isRequired,
	serial: string.isRequired,
	itemPerson: string.isRequired,
	itemPersonId: string.isRequired,
	itemHardware: string.isRequired,
	itemHardwareId: string.isRequired,
	notes: string.isRequired,
	photo: object.isRequired,
	photoNames: string.isRequired,
	people: object.isRequired,
	error: string.isRequired,
	// START Bound to dispatch
	closeItemsForm: func.isRequired,
	updateSerial: func.isRequired,
	updatePurchasedAtDate: func.isRequired,
	updateFormNotes: func.isRequired,
	updateFormPhotos: func.isRequired,
	updateItemPersonInfo: func.isRequired,
	updateItemHardwareInfo: func.isRequired,
	itemsFanout: func.isRequired,
	// END Bound to dispatch
	isSubmitDisabled: bool.isRequired,
}

export default function ItemsForm (props, context) {
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
		Object.keys(props.hardware).forEach((hardwareId) => {
			let hardwareItem = props.hardware[hardwareId]
			hardwareList = {
				...hardwareList,
				[hardwareId]: `${hardwareItem.make} ${hardwareItem.model}`,
			}
		})
		return hardwareList
	}
	function submitItems () {
		props.itemsFanout(formatItem(
			props.purchasedAtDate,
			props.serial,
			props.itemPersonId,
			props.itemHardwareId,
			props.notes,
			props.photo,
		))
	}
	return (
		<Drawer active={props.isOpen}
			className={drawer}
			onOverlayClick={props.closeItemsForm}>
			<div className={headline}>
				New Item
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
					onChange={(value) => props.updateItemPersonInfo(value)}
					source={formatPeopleList()}
					value={props.itemPerson} />
					<Autocomplete
						required={true}
						multiple={false}
						direction='down'
						selectedPosition='above'
						label='This is what kind of hardware?'
						onChange={(value) => props.updateItemHardwareInfo(value)}
						source={formatHardwareList()}
						value={props.itemHardware} />
				<br />
				<DatePicker
					label='When was the item purchased?'
					autoOk={true}
					value={props.purchasedAtDate}
					onChange={(value) => props.updatePurchasedAtDate(value)}
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateFormNotes(value)}
					label='Add note to this item?'
					value={props.notes}
					multiline={true}
					required={false}/>
				<br />
				<div className={button}>
					<Button
						raised={true}
						label='Add photo to this item?'
						primary={true} />
					<input type='file' onChange={(e) => props.updateFormPhotos(e.target.files[0])} className={imageInput}/>
				</div>
				<br />
				{props.photoNames !== ''
					? <p className={selectedPhoto}>{props.photoNames}</p>
					: ''}
				<br />
				<Button label='Add Item' type='submit' raised={true}
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
