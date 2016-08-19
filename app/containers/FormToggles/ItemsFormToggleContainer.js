import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsActionCreators from 'redux/modules/items'
import { ItemsFormToggle } from 'components'

function mapStateToProps ({items}) {
	return {
		openItemsForm: items.openItemsForm,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsFormToggle)
