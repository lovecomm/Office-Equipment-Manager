import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFormActionCreators from 'redux/modules/itemsForm'
import { ItemsFormToggle } from 'components'

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsFormActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(ItemsFormToggle)
