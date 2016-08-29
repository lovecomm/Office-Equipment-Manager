import React, { PropTypes } from 'react'
// import { TextField, RaisedButton, Drawer } from 'material-ui'
import { button, buttonSubmit, imageInput, headline, formWrapper, selectedPhoto } from './styles.css'
import { formatPerson } from 'helpers/utils'

const	{ func, bool, string, object } = PropTypes

PeopleForm.propTypes = {
	firstNameText: string.isRequired,
	lastNameText: string.isRequired,
	emailText: string.isRequired,
	photo: object.isRequired,
	photoNameText: string.isRequired,
	isOpen: bool.isRequired,
	closePeopleForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updateFirstNameText: func.isRequired,
	updateLastNameText: func.isRequired,
	updateEmailText: func.isRequired,
	updatePhoto: func.isRequired,
	peopleFanout: func.isRequired,
}

export default function PeopleForm (props, context) {
	function submitPeople () {
		props.peopleFanout(formatPerson(
			props.firstNameText,
			props.lastNameText,
			props.emailText,
			props.photo,
		))
	}
	return (
		<Drawer docked={false} width={400} open={props.isOpen}
			onRequestChange={props.closePeopleForm}>
			<div className={headline}>
				New Person
			</div>
			<div className={formWrapper}>
				<TextField
					onChange={(e) => props.updateFirstNameText(e.target.value)}
					hintText='First Name'
					value={props.firstNameText}
					floatingLabelText='First Name'
					fullWidth={true}
					required='true'/>
				<br />
				<TextField
					onChange={(e) => props.updateLastNameText(e.target.value)}
					hintText='Last Name'
					value={props.lastNameText}
					floatingLabelText='Last Name'
					fullWidth={true}
					required='true'/>
				<br />
				<TextField
					onChange={(e) => props.updateEmailText(e.target.value)}
					hintText='Email'
					type='email'
					value={props.emailText}
					floatingLabelText='Email'
					fullWidth={true}/>
				<br />
				<RaisedButton
					label="Select Person's Photo"
					labelPosition='before'
					className={button}>
						<input type='file' className={imageInput}
							onChange={(e) => props.updatePhoto(e.target.files[0])} />
				</RaisedButton>
				<br />
				{props.photoNameText !== ''
					? <p className={selectedPhoto}>{props.photoNameText}</p>
					: ''}
				<br />
				<RaisedButton label='Add Person' type='submit' primary={true}
					onTouchTap={submitPeople}
					disabled={props.isSubmitDisabled}
					className={buttonSubmit} />
			</div>
		</Drawer>
	)
}
