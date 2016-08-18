import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwareFormActionCreators from 'redux/modules/hardwareForm'
import { HardwareFormToggle } from 'components'

function mapStateToProps ({hardwareForm}) {
	return {
		openHardwareForm: hardwareForm.openHardwareForm,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareFormActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareFormToggle)
