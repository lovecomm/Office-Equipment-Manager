import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ItemsForm } from 'components'
import * as itemsFormActionCreators from 'redux/modules/itemsForm'

const ItemsFormContainer = React.createClass({
	render () {
		return (
			<ItemsForm {...this.props} />
		)
	},
})

function mapStateToProps ({itemsForm, people}, props) {
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
		isOpen: itemsForm.isOpen,
		purchasedAtDate: itemsForm.purchasedAtDate,
		itemId: itemsForm.itemId,
		itemPersonId: itemsForm.itemPersonId,
		itemHardwareId: itemsForm.itemHardwareId,
		notes: itemsForm.notes,
		photos: itemsForm.photos,
		photoNames: itemsForm.photoNames,
		people,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsFormActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsFormContainer)
