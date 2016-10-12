import React, { PropTypes } from 'react'
import { processImage } from 'helpers/utils'
import { Drawer, Input, Button, Checkbox } from 'react-toolbox/lib'
import { drawer, button, headline, formWrapper, selectedPhoto, imageInput, error } from './styles.scss'
const	{ func, bool, string, object } = PropTypes

HardwareForm.propTypes = {
	hardwareId: string.isRequired,
	make: string.isRequired,
	model: string.isRequired,
	description: string.isRequired,
	photo: object.isRequired,
	photoName: string.isRequired,
	isComputer: bool.isRequired,
	isOpen: bool.isRequired,
	error: string.isRequired,
	editing: bool.isRequired,
	closeHardwareForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updateHardwareFormMake: func.isRequired,
	updateHardwareFormModel: func.isRequired,
	updateHardwareFormDescription: func.isRequired,
	updateHardwareFormPhoto: func.isRequired,
	updateHardwareFormIsComputer: func.isRequired,
	newHardwareFanout: func.isRequired,
	updateHardwareFanout: func.isRequired,
}

export default function HardwareForm (props, context) {
	function submitHardware () {
		let hardware = {
			hardwareId: props.hardwareId,
			make:	props.make,
			model: props.model,
			photo: props.photo,
			description: props.description,
			isComputer: props.isComputer,
		}
		if (props.photo.name) {
			processImage(props.photo)
			.then((resizedPhoto) => {
				hardware = Object.assign(hardware, {photo: resizedPhoto})
				props.editing === false
				? props.newHardwareFanout(hardware)
				: props.updateHardwareFanout(hardware)
			})
		} else {
			props.updateHardwareFanout(hardware) // new hardware requires a photo, so we don't need to test if it's editing here
		}
	}
	return (
		<Drawer active={props.isOpen}
			className={drawer}
			type='right'
			onOverlayClick={props.closeHardwareForm}>
			<div className={headline}>
				{props.editing === false
					? 'New Hardware'
					: `Editing ${props.make} ${props.model}`}
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(value) => props.updateHardwareFormMake(value)}
					name='make'
					label='Make'
					value={props.make}
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateHardwareFormModel(value)}
					label='Model'
					value={props.model}
					required={true}/>
				<br />
				<Checkbox
          checked={props.isComputer}
					onChange={(value) => props.updateHardwareFormIsComputer(value)}
          label='Is this a computer?'/>
				<br />
				<Input
					onChange={(value) => props.updateHardwareFormDescription(value)}
					label='Hardware Description'
					value={props.description}
					multiline={true}
					rows={4}/>
				<br />
				<div className={button}>
					<Button
						raised={true}
						label={(() => {
							if (props.editing && props.photoName !== '') { // I'm testing for photoName here, because I'm loading the photoName into the form when the item is being edited, not the original photo object itself.
								return 'Change Photo?'
							} else {
								return 'Add Photo?'
							}
						})()}
						primary={true} />
					<input type='file' required={true} onChange={(e) => props.updateHardwareFormPhoto(e.target.files[0])}
					className={imageInput}/>
				</div>
				<br />
				{props.photoName !== ''
					? <p className={selectedPhoto}>{props.photoName}</p>
					: ''}
				<br />
				<Button label={(() => props.editing
					? 'Update'
					: 'Add Hardware')()}
					type='submit' raised={true}
					accent={true}
					primary={false}
					onClick={submitHardware}
					disabled={props.isSubmitDisabled}
					className={button} />
				<span className={error}>{props.error}</span>
			</div>
		</Drawer>
	)
}
