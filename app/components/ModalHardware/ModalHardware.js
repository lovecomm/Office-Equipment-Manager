import React, { PropTypes } from 'react'
import { TextField, RaisedButton } from 'material-ui'
import { default as ReactModal } from 'react-modal'
import { button, buttonSubmit, imageInput, headline, formWrapper } from './styles.css'

const modalStyles = {
	content: {
		width: 400,
		margin: '150px auto',
		height: window.innerHeight * 0.6,
		borderRadius: 3,
		background: '#FFFFFF',
		padding: 0,
	},
}

const	{ func, bool, string } = PropTypes

ModalHardware.propTypes = {
	makeText: string.isRequired,
	modelText: string.isRequired,
	descriptionText: string.isRequired,
	photoInfo: string.isRequired,
	isOpen: bool.isRequired,
	openModalHardware: func.isRequired,
	closeModalHardware: func.isRequired,
	isSubmitDisabled: bool.isRequired,
	updateMakeText: func.isRequired,
	updateModelText: func.isRequired,
	updateDescriptionText: func.isRequired,
	updatePhotoInfo: func.isRequired,
}

ModalHardware.contextTypes = {
	muiTheme: PropTypes.object,
}

export default function ModalHardware (props, context) {
	function submitHardware () {
		console.log('Make ', props.makeText)
		console.log('Model ', props.modelText)
		console.log('Description ', props.descriptionText)
		console.log('Photo ', props.photoInfo)
	}
	return (
		<span onTouchTap={props.openModalHardware} onClick={props.openModalHardware}>
			<RaisedButton label='Add Hardware' primary={true} style={{marginRight: '0', marginTop: '10px'}} />
			<ReactModal style={modalStyles} isOpen={props.isOpen} onRequestClose={props.closeModalHardware}>
				<div className={headline} style={{backgroundColor: context.muiTheme.palette.primary3Color}}>
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
			</ReactModal>
		</span>
	)
}
