import { HardwaresFilter } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwaresFeedActionCreators from 'redux/modules/hardwaresFeed'

function mapStateToProps ({hardwaresFeed}) {
	return {
		filter: hardwaresFeed.filter,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(hardwaresFeedActionCreators, dispatch)
)(HardwaresFilter)
