import React, { PropTypes } from 'react'
import { TextField, RaisedButton, Drawer } from 'material-ui'
import { button, buttonSubmit, imageInput, headline, formWrapper, selectedPhoto } from './styles.css'
import { formatHardware } from 'helpers/utils'

const	{ func, bool, string, object } = PropTypes

HardwareForm.propTypes = {
	makeText: string.isRequired,
	modelText: string.isRequired,
	descriptionText: string.isRequired,
	photo: object.isRequired,
	isOpen: bool.isRequired,
	closeHardwareForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	showSelectedPhoto: string.isRequired,
	updateMakeText: func.isRequired,
	updateModelText: func.isRequired,
	updateDescriptionText: func.isRequired,
	updatePhoto: func.isRequired,
	hardwareFanout: func.isRequired,
}

HardwareForm.contextTypes = {
	muiTheme: PropTypes.object,
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
		<Drawer docked={false} width={400} open={props.isOpen}
			onRequestChange={props.closeHardwareForm}>
			<div className={headline} style={{backgroundColor: context.muiTheme.palette.primaryBlueDark}}>
				New Hardware
			</div>
			<div className={formWrapper}>
				<TextField
					onChange={(e) => props.updateMakeText(e.target.value)}
					hintText='Make'
					value={props.makeText}
					floatingLabelText='Make'
					fullWidth={true}
					required='true'/>
				<br />
				<TextField
					onChange={(e) => props.updateModelText(e.target.value)}
					hintText='Model'
					value={props.modelText}
					floatingLabelText='Model'
					fullWidth={true}
					required='true'/>
				<br />
				<TextField
					onChange={(e) => props.updateDescriptionText(e.target.value)}
					hintText='Hardware Description'
					value={props.descriptionText}
					floatingLabelText='Hardware Description'
					multiLine={true}
					fullWidth={true}
					rows={4}/>
				<br />
				<RaisedButton
					label='Select Hardware Image'
					labelPosition='before'
					className={button}>
						<input type='file' className={imageInput}
							onChange={(e) => props.updatePhoto(e.target.files[0])} />
				</RaisedButton>
				<br />
				{props.showSelectedPhoto !== ''
					? <p className={selectedPhoto} style={{color: context.muiTheme.palette.primary2Color}}>{props.showSelectedPhoto}</p>
					: ''}
				<br />
				<RaisedButton label='Add Hardware' type='submit' primary={true}
					onTouchTap={submitHardware}
					disabled={props.isSubmitDisabled}
					className={buttonSubmit} />
			</div>
		</Drawer>
	)
}
