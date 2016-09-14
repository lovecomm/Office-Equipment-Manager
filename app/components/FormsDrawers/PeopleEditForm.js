import React, { PropTypes } from 'react'
import { Drawer, Input, Button } from 'react-toolbox/lib'
import { button, headline, formWrapper, drawer, error } from './styles.scss'
import { formatPerson } from 'helpers/utils'

const	{ func, bool, string } = PropTypes

PeopleEditForm.propTypes = {
	firstNameText: string.isRequired,
	lastNameText: string.isRequired,
	isOpen: bool.isRequired,
	closePeopleEditForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updateEditFormFirstNameText: func.isRequired,
	updateEditFormLastNameText: func.isRequired,
	peopleEditFanout: func.isRequired,
	error: string.isRequired,
}

export default function PeopleEditForm (props, context) {
	function submitPeople () {
		props.peopleEditFanout(formatPerson(
			props.personId,
			props.firstNameText,
			props.lastNameText,
		))
	}
	return (
		<Drawer active={props.isOpen}
			className={drawer}
			onOverlayClick={props.closePeopleEditForm}>
			<div className={headline}>
				Edit {props.firstNameText} {props.lastNameText}
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(value) => props.updateEditFormFirstNameText(value)}
					label='First Name'
					value={props.firstNameText}
					hint='First Name'
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateEditFormLastNameText(value)}
					label='Last Name'
					value={props.lastNameText}
					hint='Last Name'
					required={true}/>
				<br />
				<Button label='Save Person' type='submit' raised={true}
					accent={true}
					primary={false}
					onClick={submitPeople}
					disabled={props.isSubmitDisabled}
					className={button} />
				<span className={error}>{props.error}</span>
			</div>
		</Drawer>
	)
}
