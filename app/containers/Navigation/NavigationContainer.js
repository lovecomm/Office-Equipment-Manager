import React, { PropTypes } from 'react'
import { Navigation } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'

const NavigationContainer = React.createClass({
	propTypes: {
		isAuthed: PropTypes.bool.isRequired,
		changeSortOrder: PropTypes.func.isRequired,
		sortFeedCreationDate: PropTypes.func.isRequired,
		sortFeedPurchaseDate: PropTypes.func.isRequired,
		sortFeedLastName: PropTypes.func.isRequired,
		sortFeedFirstName: PropTypes.func.isRequired,
		sortFeedHardware: PropTypes.func.isRequired,
		updateActiveCards: PropTypes.func.isRequired,
	},
	changeActiveCards: function (newCardType) {
		this.props.updateActiveCards(newCardType)
	},
	render () {
		return (
			<Navigation {...this.props} changeActiveCards={this.changeActiveCards}/>
		)
	},
})

function mapStateToProps ({feed}) {
	const { isFetching, error, itemIds, filter, activeCards } = feed
	return {
		isFetching,
		error,
		itemIds,
		filter,
		activeCards,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(feedActionCreators, dispatch)
)(NavigationContainer)
