import React, { PropTypes } from 'react'
import { EditMenu } from 'components'
import { connect } from 'react-redux'

const EditMenuContainer = React.createClass({
	propTypes: {
		itemId: PropTypes.string.isRequired,
		serial: PropTypes.string.isRequired,
		itemPerson: PropTypes.object.isRequired,
		itemHardware: PropTypes.object.isRequired,
	},
	render () {
		return (
			<EditMenu {...this.props}/>
		)
	},
})

function mapStateToProps ({items, people, hardware}, ownProps) {
	const item = items[ownProps.itemId]
	return {
		itemId: item.itemId,
		serial: item.serial,
		itemHardware: hardware[item.itemHardwareId],
		itemPerson: people[item.itemPersonId],
	}
}

export default connect(mapStateToProps)(EditMenuContainer)
