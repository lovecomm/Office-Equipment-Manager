import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwareActionCreators from 'redux/modules/hardwareForm'
import { HardwareFormToggle } from 'components'

function mapDispatchToProps (dispatch) {
	return bindActionCreators(hardwareActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(HardwareFormToggle)
