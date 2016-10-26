import { PeopleSortMenu } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as peopleFeedActionCreators from 'redux/modules/peopleFeed'

function mapStateToProps () {
	return {}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(peopleFeedActionCreators, dispatch)
)(PeopleSortMenu)
