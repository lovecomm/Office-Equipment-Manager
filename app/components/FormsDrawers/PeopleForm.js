import React, { PropTypes } from 'react'
import { Drawer, Input, Button } from 'react-toolbox/lib'
import { button, headline, formWrapper, selectedPhoto, drawer, imageInput } from './styles.scss'
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
		<Drawer active={props.isOpen}
			className={drawer}
			onOverlayClick={props.closePeopleForm}>
			<div className={headline}>
				New Person
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(value) => props.updateFirstNameText(value)}
					label='First Name'
					value={props.firstNameText}
					hint='First Name'
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateLastNameText(value)}
					label='Last Name'
					value={props.lastNameText}
					hint='Last Name'
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateEmailText(value)}
					label='Email'
					type='email'
					value={props.emailText}
					hint='Email'/>
				<br />
				<div className={button}>
					<Button
						raised={true}
						label="Select this Person's Photo"
						primary={true} />
					<input type='file' onChange={(e) => props.updatePhoto(e.target.files[0])} className={imageInput}/>
				</div>
				<br />
				{props.photoNameText !== ''
					? <p className={selectedPhoto}>{props.photoNameText}</p>
					: ''}
				<br />
				<Button label='Add Person' type='submit' raised={true}
					accent={true}
					primary={false}
					onClick={submitPeople}
					disabled={props.isSubmitDisabled}
					className={button} />
			</div>
		</Drawer>
	)
}
