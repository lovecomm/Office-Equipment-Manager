import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ItemForm } from 'components'
import * as itemFormActionCreators from 'redux/modules/itemForm'

function mapStateToProps ({itemForm, people, hardwares}, props) {
	function disableSubmit () {
		if (itemForm.serial.length <= 0 ||
			itemForm.person.length <= 0 ||
			itemForm.hardware.length <= 0 ||
			itemForm.purchasedDate.length <= 0
		) {
			return true
		} else {
			return false
		}
	}
	return {
		itemId: itemForm.itemId,
		isOpen: itemForm.isOpen,
		purchasedDate: itemForm.purchasedDate,
		serial: itemForm.serial,
		person: itemForm.person,
		personId: itemForm.personId,
		hardware: itemForm.hardware,
		hardwareId: itemForm.hardwareId,
		note: itemForm.note,
		photo: itemForm.photo,
		photoName: itemForm.photoName,
		editing: itemForm.editing,
		people,
		hardwares,
		error: itemForm.error,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemFormActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemForm)
