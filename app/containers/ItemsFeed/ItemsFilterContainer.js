import { ItemsFilter } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFeedActionCreators from 'redux/modules/itemsFeed'

function mapStateToProps ({itemsFeed}) {
	return {
		filter: itemsFeed.filter,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(itemsFeedActionCreators, dispatch)
)(ItemsFilter)
