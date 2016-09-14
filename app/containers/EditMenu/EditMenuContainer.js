import React, { PropTypes } from 'react'
import { EditMenu } from 'components'
import { connect } from 'react-redux'

const EditMenuContainer = React.createClass({
	propTypes: {
		itemId: PropTypes.string.isRequired,
		serial: PropTypes.string.isRequired,
		person: PropTypes.object.isRequired,
		hardware: PropTypes.object.isRequired,
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
		hardware: hardware[item.hardwareId],
		person: people[item.personId],
	}
}

export default connect(mapStateToProps)(EditMenuContainer)
