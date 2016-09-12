import React, { PropTypes } from 'react'
import { Drawer, Input, Button, Checkbox } from 'react-toolbox/lib'
import { drawer, button, headline, formWrapper, selectedPhoto, imageInput, error } from './styles.scss'
import { formatHardware } from 'helpers/utils'

const	{ func, bool, string, object } = PropTypes

HardwareForm.propTypes = {
	makeText: string.isRequired,
	modelText: string.isRequired,
	descriptionText: string.isRequired,
	photo: object.isRequired,
	photoNameText: string.isRequired,
	isComputer: bool.isRequired,
	isOpen: bool.isRequired,
	error: string.isRequired,
	closeHardwareForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updateMakeText: func.isRequired,
	updateModelText: func.isRequired,
	updateDescriptionText: func.isRequired,
	updatePhoto: func.isRequired,
	hardwareFanout: func.isRequired,
}

export default function HardwareForm (props, context) {
	function submitHardware () {
		props.hardwareFanout(formatHardware(
			props.makeText,
			props.modelText,
			props.descriptionText,
			props.photo,
			props.isComputer,
		))
	}
	return (
		<Drawer active={props.isOpen}
			className={drawer}
			onOverlayClick={props.closeHardwareForm}>
			<div className={headline}>
				New Hardware
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(value) => props.updateMakeText(value)}
					name='make'
					label='Make'
					value={props.makeText}
					required={true}/>
				<br />
				<Input
					onChange={(value) => props.updateModelText(value)}
					label='Model'
					value={props.modelText}
					required={true}/>
				<br />
				<Checkbox
          checked={props.isComputer}
					onChange={(value) => props.updateIsComputer(value)}
          label='Is this a computer?'/>
				<br />
				<Input
					onChange={(value) => props.updateDescriptionText(value)}
					label='Hardware Description'
					value={props.descriptionText}
					multiline={true}
					rows={4}/>
				<br />
				<div className={button}>
					<Button
						raised={true}
						label='Select Hardware Image'
						primary={true} />
					<input type='file' onChange={(e) => props.updatePhoto(e.target.files[0])} className={imageInput}/>
				</div>
				<br />
				{props.photoNameText !== ''
					? <p className={selectedPhoto}>{props.photoNameText}</p>
					: ''}
				<br />
				<Button label='Add Hardware' type='submit' raised={true}
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
