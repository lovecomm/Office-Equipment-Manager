import React, { PropTypes } from 'react'
import { Button, Snackbar } from 'react-toolbox'
import { button, imageInput, snackBarContentWrapper, error, submitSuccessfulSnackbar } from './styles.scss'

ImportData.propTypes = {
	formIsShowing: PropTypes.bool.isRequired,
	selectedFileName: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired,
	submitSuccessful: PropTypes.bool.isRequired,
	handleFileSelect: PropTypes.func.isRequired,
	handleFileSubmit: PropTypes.func.isRequired,
}

export default function ImportData (props) {
	return (<div>
		<Snackbar
			active={props.formIsShowing}
			action='Import'
			onClick={() => props.handleFileSubmit()}
			type='accept'>
			<div className={snackBarContentWrapper}>
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
			className={submitSuccessfulSnackbar}
			label='Congrats! Your data was imported successfully'>
		</Snackbar>
	</div>)
}
