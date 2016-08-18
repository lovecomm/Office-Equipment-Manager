import { HardwareFormDrawer } from 'components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as modalActionCreators from 'redux/modules/hardwareForm'

function mapStateToProps ({hardwareForm}, props) {
	function disableSubmit () {
		if (hardwareForm.makeText.length <= 0 ||
			hardwareForm.modelText.length <= 0 ||
			hardwareForm.photoInfo === undefined) {
			return true
		} else {
			return false
		}
	}
	return {
		makeText: hardwareForm.makeText,
		modelText: hardwareForm.modelText,
		descriptionText: hardwareForm.descriptionText,
		photoInfo: hardwareForm.photoInfo,
		isOpen: hardwareForm.isOpen,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(modalActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareFormDrawer)
