import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PeopleForm } from 'components'
import * as peopleActionCreators from 'redux/modules/peopleForm'

function mapStateToProps ({peopleForm}, props) {
	function disableSubmit () {
		if (peopleForm.firstNameText.length <= 0 ||
			peopleForm.lastNameText.length <= 0
			// testing to see if no photo has been selected is empty
		) {
			return true
		} else {
			return false
		}
	}
	return {
		personId: peopleForm.personId,
		firstNameText: peopleForm.firstNameText,
		lastNameText: peopleForm.lastNameText,
		isOpen: peopleForm.isOpen,
		error: peopleForm.error,
		editing: peopleForm.editing,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(peopleActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleForm)
