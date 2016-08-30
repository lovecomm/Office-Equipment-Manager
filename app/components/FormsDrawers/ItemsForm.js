import React, { PropTypes } from 'react'
import { Drawer, Input, Button, DatePicker } from 'react-toolbox/lib'
import { button, headline, formWrapper, drawer } from './styles.scss'
// import { formatItem } from 'helpers/utils'

const	{ func, bool, object, string, any } = PropTypes

ItemsForm.propTypes = {
	isOpen: bool.isRequired,
	purchasedAtDate: any.isRequired,
	itemId: string.isRequired,
	itemPersonId: string.isRequired,
	itemHardwareId: string.isRequired,
	notes: object.isRequired,
	photos: object.isRequired,
	photoNames: object.isRequired,
	// START Bound to dispatch
	closeItemsForm: func.isRequired,
	updateItemId: func.isRequired,
	updatePurchasedAtDate: func.isRequired,
	updateFormNotes: func.isRequired,
	updateFormPhotos: func.isRequired,
	itemsFanout: func.isRequired,
	// END Bound to dispatch
	isSubmitDisabled: bool.isRequired,
}

export default function ItemsForm (props, context) {
	function submitItems () {
		// props.itemsFanout(formatPerson(
			// props.firstNameText,
			// props.lastNameText,
			// props.emailText,
			// props.photo,
		// ))
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
					onChange={(value) => props.updateItemId(value)}
					label='Serial #'
					value={props.itemId}
					hint='Serial #'
					required={true}/>
				<br />
				<DatePicker
					label='When was the item purchased?'
					autoOk={true}
					value={props.purchasedAtDate}
					onChange={(value) => props.updatePurchasedAtDate(value)}
					required={true}/>
				<br />
				<Button label='Add Item' type='submit' raised={true}
					accent={true}
					primary={false}
					onClick={submitItems}
					disabled={props.isSubmitDisabled}
					className={button} />
			</div>
		</Drawer>
	)
}
