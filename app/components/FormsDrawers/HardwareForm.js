import React, { PropTypes } from 'react'
import { Drawer, Input, Button } from 'react-toolbox/lib'
import { button, buttonSubmit, headline, formWrapper, selectedPhoto } from './styles.css'
import { formatHardware } from 'helpers/utils'

const	{ func, bool, string, object } = PropTypes

HardwareForm.propTypes = {
	makeText: string.isRequired,
	modelText: string.isRequired,
	descriptionText: string.isRequired,
	photo: object.isRequired,
	photoNameText: string.isRequired,
	isOpen: bool.isRequired,
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
		))
	}
	return (
		<Drawer active={props.isOpen} type='left'
			onOverlayClick={props.closeHardwareForm}>
			<div className={headline}>
				New Hardware
			</div>
			<div className={formWrapper}>
				<Input
					onChange={(e) => props.updateMakeText(e.target.value)}
					label='Make'
					value={props.makeText}
					hint='Make'
					required={true}/>
				<br />
				<Input
					onChange={(e) => props.updateModelText(e.target.value)}
					label='Model'
					value={props.modelText}
					hint='Model'
					required={true}/>
				<br />
				<Input
					onChange={(e) => props.updateDescriptionText(e.target.value)}
					label='Hardware Description'
					value={props.descriptionText}
					hint='Hardware Description'
					multiline={true}
					rows={4}/>
				<br />
				<Input
					label='Select Hardware Image'
					labelPosition='before'
					type='file'
					onChange={(e) => props.updatePhoto(e.target.files[0])}
					className={button} />
				<br />
				{props.photoNameText !== ''
					? <p className={selectedPhoto}>{props.photoNameText}</p>
					: ''}
				<br />
				<Button label='Add Hardware' type='submit' primary={true}
					onClick={submitHardware}
					disabled={props.isSubmitDisabled}
					className={buttonSubmit} />
			</div>
		</Drawer>
	)
}
