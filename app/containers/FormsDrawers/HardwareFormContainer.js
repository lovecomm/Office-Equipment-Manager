import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { HardwareForm } from 'components'
import * as hardwareActionCreators from 'redux/modules/hardware'

function mapStateToProps ({hardware}, props) {
	function disableSubmit () {
		if (hardware.makeText.length <= 0 ||
			hardware.modelText.length <= 0 ||
			hardware.photoInfo === undefined) {
			return true
		} else {
			return false
		}
	}
	return {
		makeText: hardware.makeText,
		modelText: hardware.modelText,
		descriptionText: hardware.descriptionText,
		photoInfo: hardware.photoInfo,
		isOpen: hardware.isOpen,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareForm)
