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

function mapStateToProps ({itemsForm, people, hardware}, props) {
	function disableSubmit () {
		if (itemsForm.serial.length <= 0 ||
			itemsForm.itemPerson.length <= 0 ||
			itemsForm.itemHardware.length <= 0 ||
			itemsForm.purchasedAtDate.length <= 0
		) {
			return true
		} else {
			return false
		}
	}
	return {
		isOpen: itemsForm.isOpen,
		purchasedAtDate: itemsForm.purchasedAtDate,
		serial: itemsForm.serial,
		itemPerson: itemsForm.itemPerson,
		itemPersonId: itemsForm.itemPersonId,
		itemHardware: itemsForm.itemHardware,
		itemHardwareId: itemsForm.itemHardwareId,
		notes: itemsForm.notes,
		photo: itemsForm.photo,
		photoNames: itemsForm.photoNames,
		people,
		hardware,
		error: itemsForm.error,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsFormActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsFormContainer)
