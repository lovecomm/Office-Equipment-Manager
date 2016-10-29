import React, { PropTypes } from 'react'
import { DeleteData } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as deleteDataActionCreators from 'redux/modules/deleteData'

const DeleteDataContainer = React.createClass({
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
			<DeleteData {...this.props}
				handleConfirmDeleteTimeout={this.handleConfirmDeleteTimeout}
				handleDeleteData={this.handleDeleteData}
				handleDeletion={this.handleDeletion}/>
		)
	},
})

function mapStateToProps ({itemsFeed, peopleFeed, hardwaresFeed, deleteData}, ownProps) {
	const forAllProps = {
		confirmDeleteActive: deleteData.confirmDeleteActive,
		toDeleteType: deleteData.toDeleteType,
		toDeleteId: deleteData.toDeleteId,
	}

	switch (ownProps.type) {
	case 'item':
		const item = itemsFeed.items[ownProps.id]
		return {
			...forAllProps,
			type: ownProps.type,
			itemId: item.itemId,
			serial: item.serial,
			hardware: hardwaresFeed.hardwares[item.hardwareId],
			person: peopleFeed.people[item.personId],
		}
	case 'person':
		const person = peopleFeed.people[ownProps.id]
		return {
			...forAllProps,
			type: ownProps.type,
			person,
		}
	case 'hardware':
		const hardware = hardwaresFeed.hardwares[ownProps.id]
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
	(dispatch) => bindActionCreators(deleteDataActionCreators, dispatch),
)(DeleteDataContainer)
