import React, { PropTypes } from 'react'
import { Drawer, Input, Button, Checkbox } from 'react-toolbox/lib'
import { drawer, button, headline, formWrapper, selectedPhoto, imageInput, error } from './styles.scss'
import { formatHardware } from 'helpers/utils'

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
	updateMake: func.isRequired,
	updateModel: func.isRequired,
	updateDescription: func.isRequired,
	updatePhoto: func.isRequired,
	hardwareFanout: func.isRequired,
}

export default function HardwareForm (props, context) {
	function submitHardware () {
		props.hardwareFanout({
			hardwareId: props.hardwareId,
			editing: props.editing,
			make:	props.make,
			model: props.model,
			description: props.description,
			photo: props.photo,
			isComputer: props.isComputer,
		})
	}
	return (
		<Drawer active={props.isOpen}
			className={drawer}
			onOverlayClick={props.closeHardwareForm}>
			<div className={headline}>
				{props.editing === false
					? 'New Hardware'
					: `Editing ${props.make} ${props.model}`}
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(value) => props.updateMake(value)}
					name='make'
					label='Make'
					value={props.make}
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateModel(value)}
					label='Model'
					value={props.model}
					required={true}/>
				<br />
				<Checkbox
          checked={props.isComputer}
					onChange={(value) => props.updateIsComputer(value)}
          label='Is this a computer?'/>
				<br />
				<Input
					onChange={(value) => props.updateDescription(value)}
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
					<input type='file' onChange={(e) => props.updatePhoto(e.target.files[0])} className={imageInput}/>
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
