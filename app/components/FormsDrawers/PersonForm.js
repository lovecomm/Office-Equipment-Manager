import React, { PropTypes } from 'react'
import { Drawer, Input, Button } from 'react-toolbox/lib'
import { button, headline, formWrapper, drawer, error } from './styles.scss'

const	{ func, bool, string } = PropTypes

PersonForm.propTypes = {
	personId: string.isRequired,
	firstName: string.isRequired,
	lastName: string.isRequired,
	isOpen: bool.isRequired,
	editing: bool.isRequired,
	closePersonForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updatePersonFormFirstName: func.isRequired,
	updatePersonFormLastName: func.isRequired,
	newPersonFanout: func.isRequired,
	updatePersonFanout: func.isRequired,
	error: string.isRequired,
}

export default function PersonForm (props, context) {
	function submitPeople () {
		const person = {
			personId: props.personId,
			firstName: props.firstName,
			lastName: props.lastName,
		}
		props.editing === false
		? props.newPersonFanout(person)
		: props.updatePersonFanout(person)
	}
	return (
		<Drawer active={props.isOpen}
			className={drawer}
			onOverlayClick={props.closePersonForm}>
			<div className={headline}>
				{props.editing === false
				? 'New Person'
				: `Editing ${props.firstName} ${props.lastName}`}
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(value) => props.updatePersonFormFirstName(value)}
					label='First Name'
					value={props.firstName}
					hint='First Name'
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updatePersonFormLastName(value)}
					label='Last Name'
					value={props.lastName}
					hint='Last Name'
					required={true}/>
				<br />
				<Button label={(() => props.editing ? 'Update' : 'Save Person')()} type='submit' raised={true}
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
