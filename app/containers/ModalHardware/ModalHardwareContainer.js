import { ModalHardware } from 'components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as modalActionCreators from 'redux/modules/modalHardware'

function mapStateToProps ({modalHardware}, props) {
	function disableSubmit () {
		if (modalHardware.makeText.length <= 0 ||
			modalHardware.modelText.length <= 0 ||
			modalHardware.photoInfo === undefined) {
			return true
		} else {
			return false
		}
	}
	return {
		makeText: modalHardware.makeText,
		modelText: modalHardware.modelText,
		descriptionText: modalHardware.descriptionText,
		photoInfo: modalHardware.photoInfo,
		isOpen: modalHardware.isOpen,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(modalActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalHardware)
