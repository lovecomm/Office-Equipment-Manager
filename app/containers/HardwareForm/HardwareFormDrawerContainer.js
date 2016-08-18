import { HardwareFormDrawer } from 'components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as modalActionCreators from 'redux/modules/hardwareFormAdd'

function mapStateToProps ({hardwareFormAdd}, props) {
	function disableSubmit () {
		if (hardwareFormAdd.makeText.length <= 0 ||
			hardwareFormAdd.modelText.length <= 0 ||
			hardwareFormAdd.photoInfo === undefined) {
			return true
		} else {
			return false
		}
	}
	return {
		makeText: hardwareFormAdd.makeText,
		modelText: hardwareFormAdd.modelText,
		descriptionText: hardwareFormAdd.descriptionText,
		photoInfo: hardwareFormAdd.photoInfo,
		isOpen: hardwareFormAdd.isOpen,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(modalActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareFormDrawer)
