import React, { PropTypes } from 'react'
import { EditMenu } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'

const EditMenuContainer = React.createClass({
	propTypes: {
		itemId: PropTypes.string,
		serial: PropTypes.string,
		person: PropTypes.object,
		hardware: PropTypes.object,
		updateConfirmDeleteActive: PropTypes.func.isRequired,
		confirmDeleteData: PropTypes.func.isRequired,
		initiateDeleteData: PropTypes.func.isRequired,
	},
	handleDeletion (dataType, dataId) {
		this.props.initiateDeleteData(dataType, dataId)
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
			<EditMenu {...this.props}
				handleConfirmDeleteTimeout={this.handleConfirmDeleteTimeout}
				handleDeleteData={this.handleDeleteData}
				handleDeletion={this.handleDeletion}/>
		)
	},
})

function mapStateToProps ({items, people, hardwares, feed}, ownProps) {
	const forAllProps = {
		confirmDeleteActive: feed.confirmDeleteActive,
		toDeleteType: feed.toDeleteType,
		toDeleteId: feed.toDeleteId,
	}

	switch (ownProps.type) {
	case 'item':
		const item = items[ownProps.id]
		return {
			...forAllProps,
			type: ownProps.type,
			itemId: item.itemId,
			serial: item.serial,
			hardware: hardwares[item.hardwareId],
			person: people[item.personId],
		}
	case 'person':
		const person = people[ownProps.id]
		return {
			...forAllProps,
			type: ownProps.type,
			person,
		}
	case 'hardware':
		const hardware = hardwares[ownProps.id]
		return {
			...forAllProps,
			type: ownProps.type,
			hardware,
		}
	default:
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(feedActionCreators, dispatch),
)(EditMenuContainer)
