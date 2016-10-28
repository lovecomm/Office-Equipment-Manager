import { HardwaresSortMenu } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwaresFeedActionCreators from 'redux/modules/hardwaresFeed'

function mapStateToProps () {
	return {}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(hardwaresFeedActionCreators, dispatch)
)(HardwaresSortMenu)
