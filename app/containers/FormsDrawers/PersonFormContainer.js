import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PersonForm } from 'components'
import * as peopleActionCreators from 'redux/modules/personForm'

function mapStateToProps ({personForm}, props) {
	function disableSubmit () {
		if (personForm.firstName.length <= 0 ||
			personForm.lastName.length <= 0
			// testing to see if no photo has been selected is empty
		) {
			return true
		} else {
			return false
		}
	}
	return {
		personId: personForm.personId,
		firstName: personForm.firstName,
		lastName: personForm.lastName,
		isOpen: personForm.isOpen,
		error: personForm.error,
		editing: personForm.editing,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(peopleActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonForm)
