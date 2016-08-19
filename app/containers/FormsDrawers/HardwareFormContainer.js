import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { HardwareForm } from 'components'
import * as hardwareActionCreators from 'redux/modules/hardwareForm'

function mapStateToProps ({hardwareForm}, props) {
	function disableSubmit () {
		if (hardwareForm.makeText.length <= 0 ||
			hardwareForm.modelText.length <= 0 ||
			hardwareForm.photo === undefined) {
			return true
		} else {
			return false
		}
	}
	return {
		makeText: hardwareForm.makeText,
		modelText: hardwareForm.modelText,
		descriptionText: hardwareForm.descriptionText,
		photo: hardwareForm.photo,
		isOpen: hardwareForm.isOpen,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareForm)
