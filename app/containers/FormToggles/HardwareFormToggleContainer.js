import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwareActionCreators from 'redux/modules/hardwareForm'
import { HardwareFormToggle } from 'components'

function mapStateToProps ({hardwareForm}) {
	return {
		openHardwareForm: hardwareForm.openHardwareForm,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareFormToggle)
