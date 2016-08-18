import React, { PropTypes } from 'react'
import { TextField, RaisedButton, Drawer } from 'material-ui'
import { button, buttonSubmit, imageInput, headline, formWrapper } from './styles.css'

const	{ func, bool, string } = PropTypes

HardwareFormDrawer.propTypes = {
	makeText: string.isRequired,
	modelText: string.isRequired,
	descriptionText: string.isRequired,
	photoInfo: string.isRequired,
	isOpen: bool.isRequired,
	openHardwareForm: func.isRequired,
	closeHardwareForm: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updateMakeText: func.isRequired,
	updateModelText: func.isRequired,
	updateDescriptionText: func.isRequired,
	updatePhotoInfo: func.isRequired,
}

HardwareFormDrawer.contextTypes = {
	muiTheme: PropTypes.object,
}

export default function HardwareFormDrawer (props, context) {
	function submitHardware () {
		console.log('Make ', props.makeText)
		console.log('Model ', props.modelText)
		console.log('Description ', props.descriptionText)
		console.log('Photo ', props.photoInfo)
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
							onChange={(e) => props.updatePhotoInfo(e.target.value)}
							value={props.photoInfo}></input>
				</RaisedButton>
				<br />
				<RaisedButton label='Add Hardware' type='submit' primary={true}
					onTouchTap={submitHardware}
					disabled={props.isSubmitDisabled}
					className={buttonSubmit} />
			</div>
		</Drawer>
	)
}
