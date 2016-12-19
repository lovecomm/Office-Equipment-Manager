import React, { PropTypes } from 'react'
import { ImportData } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as importActionCreators from 'redux/modules/importData'
import handleFileImport from 'helpers/fileImport'

const ImportDataContainer = React.createClass({
	propTypes: {
		formIsShowing: PropTypes.bool.isRequired,
		selectedFileName: PropTypes.string.isRequired,
		submitSuccessful: PropTypes.bool.isRequired,
		updateImportdataFormSelectedFileName: PropTypes.func.isRequired,
		updateImportdataFormError: PropTypes.func.isRequired,
		clearImportdataForm: PropTypes.func.isRequired,
		toggleImportdataFormIsShowing: PropTypes.func.isRequired,
		updateImportdataFormSubmitSuccessful: PropTypes.func.isRequired,
	},
	selectedFile: 'empty',
	handleFileSelect (fileRaw) {
		const file = fileRaw.target.files[0]
		const ext = file.name.match(/\.([^\.]+)$/)
		this.props.updateImportdataFormSelectedFileName(file.name)
		if (ext === null) {
			this.props.updateImportdataFormError('Slow Down there! Please make sure your file has an extension!')
			this.selectedFile = 'empty'
			return
		} else if (ext[1] !== 'csv') {
			this.props.updateImportdataFormError('Slow Down there! You can only import CSV files!')
			this.selectedFile = 'empty'
			return
		} else {
			this.props.updateImportdataFormError('')
			this.selectedFile = file
		}
	},
	handleFileSubmit () {
		if (this.selectedFile !== 'empty') {
			this.props.updateImportdataIsProcessing(true)
			handleFileImport(this.selectedFile)
			.then(() => this.submitSuccessful())
			.catch((error) => this.props.updateImportdataFormError(error))
		}
	},
	submitSuccessful () {
		this.props.updateImportdataIsProcessing(false)
		this.props.toggleImportdataFormIsShowing() // hide import form snackbar
		this.props.updateImportdataFormSubmitSuccessful() // show "submitSuccessful message" (different Snackbar)
		setTimeout(() => this.props.clearImportdataForm(), 5000) // reset importData back to initialState
	},
	render () {
		return (<ImportData
			formIsShowing={this.props.formIsShowing}
			selectedFileName={this.props.selectedFileName}
			error={this.props.error}
			handleFileSelect={this.handleFileSelect}
			submitSuccessful ={this.props.submitSuccessful}
			handleFileSubmit={this.handleFileSubmit}/>)
	},
})

function mapStateToProps ({importData}) {
	return {
		formIsShowing: importData.formIsShowing,
		selectedFileName: importData.selectedFileName,
		error: importData.error,
		submitSuccessful: importData.submitSuccessful,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(importActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportDataContainer)
