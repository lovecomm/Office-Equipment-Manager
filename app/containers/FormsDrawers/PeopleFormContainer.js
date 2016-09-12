import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PeopleForm } from 'components'
import * as peopleActionCreators from 'redux/modules/peopleForm'

function mapStateToProps ({peopleForm}, props) {
	function disableSubmit () {
		if (peopleForm.firstNameText.length <= 0 ||
			peopleForm.lastNameText.length <= 0 ||
			peopleForm.emailText.length <= 0 ||
			// testing to see if no photo has been selected is empty
			Object.keys(peopleForm.photo).length === 0 && peopleForm.photo.constructor === Object
		) {
			return true
		} else {
			return false
		}
	}
	return {
		firstNameText: peopleForm.firstNameText,
		lastNameText: peopleForm.lastNameText,
		emailText: peopleForm.emailText,
		photo: peopleForm.photo,
		photoNameText: peopleForm.photoNameText,
		isOpen: peopleForm.isOpen,
		error: peopleForm.error,
		isSubmitDisabled: disableSubmit(),
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(peopleActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleForm)
