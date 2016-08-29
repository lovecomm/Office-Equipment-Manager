import React, { PropTypes } from 'react'
import { Drawer, Input, Button } from 'react-toolbox/lib'
import { button, buttonSubmit, headline, formWrapper, selectedPhoto } from './styles.css'
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
		<Drawer active={props.isOpen} type='left'
			onOverlayClick={props.closePeopleForm}>
			<div className={headline}>
				New Person
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(e) => props.updateFirstNameText(e.target.value)}
					label='First Name'
					value={props.firstNameText}
					hint='First Name'
					required={true}/>
				<br />
				<Input
					onChange={(e) => props.updateLastNameText(e.target.value)}
					label='Last Name'
					value={props.lastNameText}
					hint='Last Name'
					required={true}/>
				<br />
				<Input
					onChange={(e) => props.updateEmailText(e.target.value)}
					label='Email'
					type='email'
					value={props.emailText}
					hint='Email'/>
				<br />
				<Input
					label="Select Person's Photo"
					onChange={(e) => props.updatePhoto(e.target.files[0])}
					type='file'
					className={button} />
				<br />
				{props.photoNameText !== ''
					? <p className={selectedPhoto}>{props.photoNameText}</p>
					: ''}
				<br />
				<Button label='Add Person' type='submit' primary={true}
					onClick={submitPeople}
					disabled={props.isSubmitDisabled}
					className={buttonSubmit} />
			</div>
		</Drawer>
	)
}
