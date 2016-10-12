import React, { PropTypes } from 'react'
import { EditMenu } from 'components'
import { connect } from 'react-redux'
import { initiateDeleteData } from 'redux/modules/feed'

const EditMenuContainer = React.createClass({
	propTypes: {
		itemId: PropTypes.string,
		serial: PropTypes.string,
		person: PropTypes.object,
		hardware: PropTypes.object,
		dispatch: PropTypes.func.isRequired,
	},
	handleDeletion (dataType, dataId) {
		this.props.dispatch(initiateDeleteData(dataType, dataId))
	},
	render () {
		return (
			<EditMenu {...this.props} handleDeletion={this.handleDeletion}/>
		)
	},
})

function mapStateToProps ({items, people, hardwares}, ownProps) {
	switch (ownProps.type) {
	case 'item':
		const item = items[ownProps.id]
		return {
			type: ownProps.type,
			itemId: item.itemId,
			serial: item.serial,
			hardware: hardwares[item.hardwareId],
			person: people[item.personId],
		}
	case 'person':
		const person = people[ownProps.id]
		return {
			type: ownProps.type,
			person,
		}
	case 'hardware':
		const hardware = hardwares[ownProps.id]
		return {
			type: ownProps.type,
			hardware,
		}
	default:
	}
}

export default connect(mapStateToProps)(EditMenuContainer)
