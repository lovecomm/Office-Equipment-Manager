import React, { PropTypes } from 'react'
import { processImage } from 'helpers/utils'
import { Loader } from 'components'
import { Drawer, Input, Button } from 'react-toolbox/lib'
import { button, headline, formWrapper, drawer, error, imageInput, selectedPhoto } from './styles.scss'

const	{ func, bool, string, object } = PropTypes

PersonForm.propTypes = {
	personId: string.isRequired,
	firstName: string.isRequired,
	lastName: string.isRequired,
	photo: object.isRequired,
	photoName: string.isRequired,
	isOpen: bool.isRequired,
	editing: bool.isRequired,
	isSubmitting: bool.isRequired,
	closePersonForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updatePersonFormFirstName: func.isRequired,
	updatePersonFormLastName: func.isRequired,
	updatePersonFormPhoto: func.isRequired,
	newPersonFanout: func.isRequired,
	updatePersonFanout: func.isRequired,
	error: string.isRequired,
	updatePersonFormIsSubmitting: func.isRequired,
}

export default function PersonForm (props, context) {
	function submitPeople () {
		props.updatePersonFormIsSubmitting(true)
		let person = {
			personId: props.personId,
			firstName: props.firstName,
			lastName: props.lastName,
			photo: props.photo,
		}
		if (props.photo.name) {
			processImage(props.photo)
			.then((resizedPhoto) => {
				person = Object.assign(person, {photo: resizedPhoto})
				props.editing === false
				? props.newPersonFanout(person)
				: props.updatePersonFanout(person)
			})
		} else {
			props.updatePersonFanout(person) // new people requires a photo, so we don't need to test if it's editing here
		}
	}
	return (
		<Drawer active={props.isOpen}
			className={drawer}
			type='right'
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
				<div className={button}>
					<Button
						raised={true}
						label={(() => {
							if (props.editing && props.photoName !== '') { // I'm testing for photoName here, because I'm loading the photoName into the form when the item is being edited, not the original photo object itself.
								return 'Change Photo?'
							} else {
								return 'Add Photo'
							}
						})()}
						primary={true} />
					<input type='file' required={true} onChange={(e) => props.updatePersonFormPhoto(e.target.files[0])}
					className={imageInput}/>
				</div>
				<br />
				{props.photoName !== ''
					? <div><p className={selectedPhoto}>{props.photoName}</p><br /></div>
					: ''}
				<Button label={(() => props.editing ? 'Update' : 'Save Person')()} type='submit' raised={true}
					accent={true}
					primary={false}
					onClick={submitPeople}
					disabled={props.isSubmitDisabled}
					className={button} />
				{props.error === '' && props.isSubmitting === true
				? <div style={{position: 'relative'}}><Loader marginTop='25px' marginBottom='0' /></div>
				: ''}
				<span className={error}>{props.error}</span>
			</div>
		</Drawer>
	)
}
