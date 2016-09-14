import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as peopleActionCreators from 'redux/modules/peopleForm'
import { PeopleFormToggle } from 'components'

const PeopleFormToggleContainer = React.createClass({
	propTypes: {
		person: PropTypes.object, // only going to be getting a person if the user is editing a person, not if they are creating a new one.
		editing: PropTypes.bool.isRequired,
		openPeopleForm: PropTypes.func.isRequired,
		initiatePeopleForm: PropTypes.func.isRequired,
	},
	handleOpenEditForm () {
		if (this.props.editing) {
			this.props.initiatePeopleForm(this.props.person.personId)
		} else {
			this.props.openPeopleForm()
		}
	},
	render () {
		return (
			<PeopleFormToggle
				handleOpenEditForm={this.handleOpenEditForm}
				person={(() => this.props.person === undefined ? '' : this.props.person)()} />
		)
	},
})

function mapDispatchToProps (dispatch) {
	return bindActionCreators(peopleActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(PeopleFormToggleContainer)
