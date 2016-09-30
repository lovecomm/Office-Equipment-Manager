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
	updateFirstName: func.isRequired,
	updateLastName: func.isRequired,
	personFanout: func.isRequired,
	error: string.isRequired,
}

export default function PersonForm (props, context) {
	function submitPeople () {
		props.personFanout({
			editing: props.editing,
			personId: props.personId,
			firstName: props.firstName,
			lastName: props.lastName,
		})
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
					onChange={(value) => props.updateFirstName(value)}
					label='First Name'
					value={props.firstName}
					hint='First Name'
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateLastName(value)}
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
