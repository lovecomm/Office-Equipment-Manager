import React, { PropTypes } from 'react'
import { ImportData } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as importActionCreators from 'redux/modules/importData'

const ImportDataContainer = React.createClass({
	propTypes: {
		formIsShowing: PropTypes.bool.isRequired,
		selectedFileName: PropTypes.string.isRequired,
		submitSuccessful: PropTypes.bool.isRequired,
		updateImportdataFormSelectedFileName: PropTypes.func.isRequired,
		updateImportdataFormError: PropTypes.func.isRequired,
		handleClearImportdataForm: PropTypes.func.isRequired,
		toggleImportdataFormIsShowing: PropTypes.func.isRequired,
		updateImportdataFormSubmitSuccessful: PropTypes.func.isRequired,
		handleFileImportThunk: PropTypes.func.isRequired,
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
			setTimeout(() => {
				this.props.handleFileImportThunk(this.selectedFile)
				.then(() => this.submitSuccessful())
				.catch((error) => this.props.updateImportdataFormError(error))
			}, 300)
		}
	},
	submitSuccessful () {
		this.props.updateImportdataIsProcessing(false)
		this.props.toggleImportdataFormIsShowing() // hide import form snackbar
		this.props.updateImportdataFormSubmitSuccessful() // show "submitSuccessful message" (different Snackbar)
	},
	render () {
		return (<ImportData
			formIsShowing={this.props.formIsShowing}
			selectedFileName={this.props.selectedFileName}
			error={this.props.error}
			duplicateItemsIds={this.props.duplicateItemsIds}
			handleFileSelect={this.handleFileSelect}
			submitSuccessful={this.props.submitSuccessful}
			handleClearImportdataForm={this.props.handleClearImportdataForm}
			handleFileSubmit={this.handleFileSubmit}/>)
	},
})

function mapStateToProps ({importData}) {
	return {
		formIsShowing: importData.formIsShowing,
		selectedFileName: importData.selectedFileName,
		error: importData.error,
		submitSuccessful: importData.submitSuccessful,
		duplicateItemsIds: importData.duplicateItemsIds,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(importActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportDataContainer)
