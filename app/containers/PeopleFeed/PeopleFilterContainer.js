import { PeopleFilter } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as peopleFeedActionCreators from 'redux/modules/peopleFeed'

function mapStateToProps ({peopleFeed}) {
	return {
		filter: peopleFeed.filter,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(peopleFeedActionCreators, dispatch)
)(PeopleFilter)
