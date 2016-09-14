import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PeopleEditForm } from 'components'
import * as peopleActionCreators from 'redux/modules/peopleEditForm'

function mapStateToProps ({peopleEditForm}, props) {
	function disableSubmit () {
		if (peopleEditForm.firstNameText.length <= 0 ||
			peopleEditForm.lastNameText.length <= 0
			// testing to see if no photo has been selected is empty
		) {
			return true
		} else {
			return false
		}
	}
	return {
		personId: peopleEditForm.personId,
		firstNameText: peopleEditForm.firstNameText,
		lastNameText: peopleEditForm.lastNameText,
		isOpen: peopleEditForm.isOpen,
		error: peopleEditForm.error,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(peopleActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleEditForm)
