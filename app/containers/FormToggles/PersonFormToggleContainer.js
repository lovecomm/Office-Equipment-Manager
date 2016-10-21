import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as peopleActionCreators from 'redux/modules/personForm'
import { PersonFormToggle } from 'components'

const PersonFormToggleContainer = React.createClass({
	propTypes: {
		personId: PropTypes.string, // only going to be getting a person if the user is editing a person, not if they are creating a new one.
		editing: PropTypes.bool.isRequired,
		openPersonForm: PropTypes.func.isRequired,
		initiatePersonForm: PropTypes.func.isRequired,
	},
	handleOpenEditForm () {
		if (this.props.editing) {
			this.props.initiatePersonForm(this.props.personId)
		} else {
			this.props.openPersonForm()
		}
	},
	render () {
		return (
			<PersonFormToggle
				handleOpenEditForm={this.handleOpenEditForm}
				editing={this.props.editing} />
		)
	},
})

function mapDispatchToProps (dispatch) {
	return bindActionCreators(peopleActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(PersonFormToggleContainer)
