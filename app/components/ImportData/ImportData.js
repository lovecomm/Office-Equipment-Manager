import React, { PropTypes } from 'react'
import { Button, Snackbar } from 'react-toolbox'
import { button, imageInput, snackBarContentWrapper, error, submitSuccessfulSnackbar, cancelButton, warning } from './styles.scss'

ImportData.propTypes = {
	formIsShowing: PropTypes.bool.isRequired,
	selectedFileName: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired,
	duplicateItemsIds: PropTypes.string.isRequired,
	submitSuccessful: PropTypes.bool.isRequired,
	handleFileSelect: PropTypes.func.isRequired,
	handleFileSubmit: PropTypes.func.isRequired,
	handleClearImportdataForm: PropTypes.func.isRequired,
}

export default function ImportData (props) {
	return (<div>
		<Snackbar
			active={props.formIsShowing}
			action='Import'
			onClick={() => props.handleFileSubmit()}
			type='accept'>
			<div className={snackBarContentWrapper}>
				<Button label='Cancel' raised={true} onClick={() => props.handleClearImportdataForm()} className={cancelButton} />
				<div className={button}>
					<Button raised={true} label='Select .csv file' primary={true} />
					<input type='file' required={true} className={imageInput}
						onChange={(e) => props.handleFileSelect(e)}/>
				</div>
				<span>{props.selectedFileName}</span>
				{(() => props.error !== '' ? (<span className={error}>{props.error}</span>) : '')()}
			</div>
		</Snackbar>
		<Snackbar
			active={props.submitSuccessful}
			className={submitSuccessfulSnackbar}>
			{props.duplicateItemsIds === ''
			? <div>Congrats! Your data was imported successfully.</div>
			: <div>
					<p className={warning}>Your data was processed successfully, but the following items were not imported because they are duplicates:</p>
					<p>{props.duplicateItemsIds}</p>
				</div>}
			<Button label='Close' raised={true} onClick={() => props.handleClearImportdataForm()} className={cancelButton} />
		</Snackbar>
	</div>)
}
