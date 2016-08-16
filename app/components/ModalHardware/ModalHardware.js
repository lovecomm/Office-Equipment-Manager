import React, { PropTypes } from 'react'
import { TextField, RaisedButton } from 'material-ui'
import { default as ReactModal } from 'react-modal'
import { button, imageInput } from './styles.css'

const modalStyles = {
  content: {
    width: 350,
    margin: '150px auto',
    height: 220,
    borderRadius: 5,
    background: '#EBEBEB',
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

export default function ModalHardware (props) {
	function submitHardware () {
		console.log('Make ', props.makeText)
		console.log('Model ', props.modelText)
		console.log('Description ', props.descriptionText)
		console.log('Photo ', props.photoInfo)
	}
	return (
		<span onClick={props.openModalHardware}>
			{'Add Hardware'}
			<ReactModal style={modalStyles} isOpen={props.isOpen} onRequestClose={props.closeModalHardware}>
				<TextField
					onChange={(e) => props.updateMakeText(e.target.value)}
					hintText='Make'
					value={props.makeText}
					floatingLabelText='Make'
					required='true'/>
				<br />
				<TextField
					onChange={(e) => props.updateModelText(e.target.value)}
					hintText='Model'
					value={props.modelText}
					floatingLabelText='Model'
					required='true'/>
				<br />
				<TextField
					onChange={(e) => props.updateDescriptionText(e.target.value)}
					hintText='Hardware Description'
					value={props.descriptionText}
					floatingLabelText='Hardware Description'
					multiLine={true}
					rows={4}/>
				<br />
				<RaisedButton
					onChange={(e) => props.updatePhotoInfo(e.target.value)}
					label='Choose an Image'
					labelPosition='before'
					value={props.photoInfo}
					className={button}>
					<input type='file' className={imageInput} />
				</RaisedButton>
				<br />
				<RaisedButton label='Add Hardware' type='submit' 			primary={true}
					onTouchTap={submitHardware}
					disabled={props.isSubmitDisabled}
					className={button} />
			</ReactModal>
		</span>
	)
}
