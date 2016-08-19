import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { HardwareForm } from 'components'
import * as hardwareActionCreators from 'redux/modules/hardwareForm'

function mapStateToProps ({hardwareForm}, props) {
	function disableSubmit () {
		if (hardwareForm.makeText.length <= 0 ||
			hardwareForm.modelText.length <= 0 ||
			hardwareForm.descriptionText.length <= 0 ||
			// testing to see if no photo has been selected is empty
			Object.keys(hardwareForm.photo).length === 0 && hardwareForm.photo.constructor === Object) {
			return true
		} else {
			return false
		}
	}
	function showSelectedPhoto () {
		if (Object.keys(hardwareForm.photo).length === 0 && hardwareForm.photo.constructor === Object) {
			return ''
		} else {
			return hardwareForm.photo.name
		}
	}
	return {
		makeText: hardwareForm.makeText,
		modelText: hardwareForm.modelText,
		descriptionText: hardwareForm.descriptionText,
		photo: hardwareForm.photo,
		isOpen: hardwareForm.isOpen,
		isSubmitDisabled: disableSubmit(),
		showSelectedPhoto: showSelectedPhoto(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareForm)
