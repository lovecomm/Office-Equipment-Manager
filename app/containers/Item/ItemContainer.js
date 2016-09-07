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
	// getStatus () {
	// 	const yearsOld = this.getYearsOld()
	// 	if (this.props.itemHardware.isComputer === true) {
	// 		if (yearsOld >= '5') {
	// 			return `This computer was purchased more than ${yearsOld} years ago. It needs to be replaced!`
	// 		} else if (yearsOld >= '3') {
	// 			return `This computer was purchased more than ${yearsOld} years ago. You should think about replacing it soon.`
	// 		} else if (yearsOld >= '1') {
	// 			return `This computer was purchased more than ${yearsOld} year(s) ago.`
	// 		} else {
	// 			return 'This computer was purchased less than a year ago.'
	// 		}
	// 	} else if (yearsOld >= '1') {
	// 		return `This item was purchased more than ${yearsOld} year(s) ago.`
	// 	} else {
	// 		return 'This item was purchased less than a year ago.'
	// 	}
	// },
	getYearsOld () {
		const itemDate = new Date(this.props.purchasedAtDate)
		const currentDate = new Date()
		const timeDiff = Math.abs(currentDate.getTime() - itemDate.getTime())
		const diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24)) / 365
		return Math.floor(diffYears).toString()
	},
	render () {
		return (
			<Item
				serial={this.props.serial}
				hardware={this.props.itemHardware}
				person={this.props.itemPerson}
				notes={this.props.notes}
				purchasedAtDate={this.formatDate()}
				getYearsOld={this.getYearsOld()}
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
