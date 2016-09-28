import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { HardwareForm } from 'components'
import * as hardwareActionCreators from 'redux/modules/hardwareForm'

function mapStateToProps ({hardwareForm}, props) {
	function disableSubmit () {
		if (hardwareForm.make.length <= 0 ||
			hardwareForm.model.length <= 0 ||
			// testing to see if no photo has been selected is empty
			hardwareForm.photoName === '') {
			return true
		} else {
			return false
		}
	}
	return {
		hardwareId: hardwareForm.hardwareId,
		make: hardwareForm.make,
		model: hardwareForm.model,
		description: hardwareForm.description,
		photo: hardwareForm.photo,
		photoName: hardwareForm.photoName,
		isComputer: hardwareForm.isComputer,
		isOpen: hardwareForm.isOpen,
		error: hardwareForm.error,
		editing: hardwareForm.editing,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareForm)
