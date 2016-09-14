import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ItemsEditForm } from 'components'
import * as itemsEditFormActionCreators from 'redux/modules/itemsEditForm'

function mapStateToProps ({itemsEditForm, people, hardware}, props) {
	function disableSubmit () {
		if (itemsEditForm.serial.length <= 0 ||
			itemsEditForm.itemPerson.length <= 0 ||
			itemsEditForm.itemHardware.length <= 0 ||
			itemsEditForm.purchasedAtDate.length <= 0
		) {
			return true
		} else {
			return false
		}
	}
	return {
		itemId: itemsEditForm.itemId,
		isOpen: itemsEditForm.isOpen,
		purchasedAtDate: itemsEditForm.purchasedAtDate,
		serial: itemsEditForm.serial,
		itemPerson: itemsEditForm.itemPerson,
		itemPersonId: itemsEditForm.itemPersonId,
		itemHardware: itemsEditForm.itemHardware,
		itemHardwareId: itemsEditForm.itemHardwareId,
		notes: itemsEditForm.notes,
		photo: itemsEditForm.photo,
		photoNames: itemsEditForm.photoNames,
		people,
		hardware,
		error: itemsEditForm.error,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsEditFormActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsEditForm)
