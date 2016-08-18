import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwareActionCreators from 'redux/modules/hardware'
import { HardwareFormToggle } from 'components'

function mapStateToProps ({hardware}) {
	return {
		openHardwareForm: hardware.openHardwareForm,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareFormToggle)
