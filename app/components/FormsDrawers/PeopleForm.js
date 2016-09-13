import React, { PropTypes } from 'react'
import { Drawer, Input, Button } from 'react-toolbox/lib'
import { button, headline, formWrapper, drawer, error } from './styles.scss'
import { formatPerson } from 'helpers/utils'

const	{ func, bool, string } = PropTypes

PeopleForm.propTypes = {
	firstNameText: string.isRequired,
	lastNameText: string.isRequired,
	isOpen: bool.isRequired,
	closePeopleForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updateFirstNameText: func.isRequired,
	updateLastNameText: func.isRequired,
	peopleFanout: func.isRequired,
	error: string.isRequired,
}

export default function PeopleForm (props, context) {
	function submitPeople () {
		props.peopleFanout(formatPerson(
			props.firstNameText,
			props.lastNameText,
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
				<Button label='Add Person' type='submit' raised={true}
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
