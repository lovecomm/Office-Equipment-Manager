import { ItemsSortMenu } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFeedActionCreators from 'redux/modules/itemsFeed'

function mapStateToProps () {
	return {}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(itemsFeedActionCreators, dispatch)
)(ItemsSortMenu)
