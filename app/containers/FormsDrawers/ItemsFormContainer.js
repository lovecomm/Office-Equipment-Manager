import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ItemsForm } from 'components'
import * as itemsActionCreators from 'redux/modules/items'

function mapStateToProps ({items}, props) {
	function disableSubmit () {
		// if (items.firstNameText.length <= 0 ||
		// 	items.lastNameText.length <= 0 ||
		// 	items.emailText.length <= 0 ||
		// 	// testing to see if no photo has been selected is empty
		// 	Object.keys(items.photo).length === 0 && items.photo.constructor === Object
		// ) {
		// 	return true
		// } else {
		return false
		// }
	}
	return {
		isOpen: items.form.isOpen,
		purchasedAtDate: items.form.purchasedAtDate,
		itemId: items.form.itemId,
		itemPersonId: items.form.itemPersonId,
		itemHardwareId: items.form.itemHardwareId,
		notes: items.form.notes,
		photos: items.form.photos,
		photoNames: items.form.photoNames,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsForm)
