import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Item } from 'components'

const ItemsContainer = React.createClass({
	propTypes: {
		serial: PropTypes.string.isRequired,
		purchasedAtDate: PropTypes.string.isRequired,
		itemHardware: PropTypes.object.isRequired,
		itemPerson: PropTypes.object.isRequired,
		notes: PropTypes.string,
		photo: PropTypes.object,
	},
	formatDate () {
		let date = new Date(this.props.purchasedAtDate)
		var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December',
		]
		let year = date.getFullYear()
		let month = monthNames[date.getMonth()]
		return `${month} ${year}`
	},
	render () {
		// console.log(this.props)
		return (
			<Item
				serial={this.props.serial}
				hardware={this.props.itemHardware}
				person={this.props.itemPerson}
				notes={this.props.notes}
				purchasedAtDate={this.formatDate()}
				photo={this.props.photo !== undefined
					? this.props.photo.url
					: ''}/>
		)
	},
})

function mapStateToProps ({items, people, hardware}, props) {
	const item = items[props.itemId]
	return {
		serial: item.serial,
		purchasedAtDate: item.purchasedAtDate,
		itemHardware: hardware[item.itemHardwareId],
		itemPerson: people[item.itemPersonId],
		notes: item.notes,
		photo: item.photo,
	}
}

export default connect(mapStateToProps)(ItemsContainer)
