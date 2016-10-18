import React, { PropTypes } from 'react'
import { Feed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'

const FeedContainer = React.createClass({
	propTypes: {
		setAndHandleFeedListener: PropTypes.func.isRequired,
		updateConfirmDeleteActive: PropTypes.func.isRequired,
		confirmDeleteData: PropTypes.func.isRequired,
		route: PropTypes.object.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	handleConfirmDeleteTimeout () {
		this.props.updateConfirmDeleteActive(false)
	},
	handleDeleteData () {
		this.props.confirmDeleteData()
		this.props.updateConfirmDeleteActive(false)
	},
	render () {
		return (
			<Feed {...this.props} handleConfirmDeleteTimeout={this.handleConfirmDeleteTimeout}
				handleDeleteData={this.handleDeleteData} activeCards={this.props.route.activeCards}/>
		)
	},
})

function mapStateToProps ({feed}) {
	const { isFetching, error, itemIds, personIds, hardwareIds, confirmDeleteActive, toDeleteType, toDeleteId } = feed
	return {
		isFetching,
		error,
		itemIds,
		personIds,
		hardwareIds,
		confirmDeleteActive,
		toDeleteType,
		toDeleteId,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(feedActionCreators, dispatch)
)(FeedContainer)
