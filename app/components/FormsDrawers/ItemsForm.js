import React, { PropTypes } from 'react'
import { TextField, RaisedButton, Drawer } from 'material-ui'
import { buttonSubmit, headline, formWrapper } from './styles.css'
// import { formatItem } from 'helpers/utils'

const	{ func, bool, object, string } = PropTypes

ItemsForm.propTypes = {
	isOpen: bool.isRequired,
	purchasedAtDate: string.isRequired,
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

ItemsForm.contextTypes = {
	muiTheme: PropTypes.object,
}

export default function ItemsForm (props, context) {
	function submitItems () {
		// props.itemsFanout(formatPerson(
			// props.firstNameText,
			// props.lastNameText,
			// props.emailText,
			// props.photo,
		// ))
		console.log('submitting item')
	}
	return (
		<Drawer docked={false} width={400} open={props.isOpen}
			onRequestChange={props.closeItemsForm}>
			<div className={headline} style={{backgroundColor: context.muiTheme.palette.primaryBlueDark}}>
				New Item
			</div>
			<div className={formWrapper}>
				<TextField
					onChange={(e) => props.updateItemId(e.target.value)}
					hintText='Item ID'
					value={props.itemId}
					floatingLabelText='Item ID'
					fullWidth={true}
					required='true'/>
				<br />
				<TextField
					onChange={(e) => props.updatePurchasedAtDate(e.target.value)}
					hintText='When was the Item Purchased?'
					value={props.purchasedAtDate}
					floatingLabelText='When was the Item Purchased?'
					fullWidth={true}
					required='true'/>
				<br />
				<RaisedButton label='Add Person' type='submit' primary={true}
					onTouchTap={submitItems}
					disabled={props.isSubmitDisabled}
					className={buttonSubmit} />
			</div>
		</Drawer>
	)
}
