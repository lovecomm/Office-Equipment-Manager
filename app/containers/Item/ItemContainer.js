import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Item } from 'components'
import { bindActionCreators } from 'redux'
import * as itemActionCreators from 'redux/modules/items'
import { cardExpandable, cardNoExpand } from './styles.scss'

const ItemsContainer = React.createClass({
	propTypes: {
		serial: PropTypes.string.isRequired,
		itemHardware: PropTypes.object.isRequired,
		itemPerson: PropTypes.object.isRequired,
		notes: PropTypes.string.isRequired,
		photo: PropTypes.object,
		hasSubContent: PropTypes.bool.isRequired,
		purchasedAtDate: PropTypes.string.isRequired,
		itemId: PropTypes.string.isRequired,
		collapsed: PropTypes.bool.isRequired,
		handleCollapsed: PropTypes.func.isRequired,
	},
	getYearsOld () {
		const itemDate = new Date(this.props.purchasedAtDate)
		const currentDate = new Date()
		const timeDiff = Math.abs(currentDate.getTime() - itemDate.getTime())
		const diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24)) / 365
		return Math.floor(diffYears).toString()
	},
	envokeHandleCollapsed () {
		const newCollapse = !this.props.collapsed
		this.props.handleCollapsed(this.props.itemId, newCollapse)
	},
	cardClass () {
		if (this.props.hasSubContent) {
			return cardExpandable
		} else { return cardNoExpand }
	},
	render () {
		return (
			<Item
				{...this.props}
				getYearsOld={this.getYearsOld()}
				cardClass={this.cardClass()}
				envokeHandleCollapsed={this.envokeHandleCollapsed}/>
		)
	},
})

function mapStateToProps ({items, people, hardware}, props) {
	// not all items are used at once, so this needs to get only the items on the feed.itemIds
	const item = items[props.itemId]
	return {
		serial: item.serial,
		hasSubContent: item.hasSubContent,
		itemId: item.itemId,
		itemHardware: hardware[item.itemHardwareId],
		itemPerson: people[item.itemPersonId],
		notes: item.notes,
		photo: item.photo,
		purchasedAtDate: item.purchasedAtDate,
		collapsed: item.collapsed,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(itemActionCreators, dispatch)
)(ItemsContainer)
