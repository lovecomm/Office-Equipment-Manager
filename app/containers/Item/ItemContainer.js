import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Item } from 'components'

const ItemsContainer = React.createClass({
	propTypes: {
		itemId: PropTypes.string.isRequired,
		dateCreated: PropTypes.number.isRequired,
		itemHardware: PropTypes.object.isRequired,
		itemPerson: PropTypes.object.isRequired,
		notes: PropTypes.string,
		photo: PropTypes.object,
	},
	render () {
		return (
			<Item {...this.props}/>
		)
	},
})

function mapStateToProps ({items, people, hardware}, props) {
	const item = items[props.itemId]
	return {
		serial: item.serial,
		dateCreated: item.dateCreated,
		itemHardware: hardware[item.itemHardwareId],
		itemPerson: people[item.itemPersonId],
		notes: item.notes,
		photo: item.photo,
	}
}

export default connect(mapStateToProps)(ItemsContainer)
