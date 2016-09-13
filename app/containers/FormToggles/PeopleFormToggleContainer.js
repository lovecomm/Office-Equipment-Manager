import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as peopleActionCreators from 'redux/modules/peopleForm'
import { PeopleFormToggle } from 'components'

function mapDispatchToProps (dispatch) {
	return bindActionCreators(peopleActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(PeopleFormToggle)
