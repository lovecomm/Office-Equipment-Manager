import React, { PropTypes } from 'react'
import { container, header, title, body } from './styles.css'

const WrapperContainer = React.createClass({
	propTypes: {
		children: PropTypes.element.isRequired,
		title: PropTypes.string.isRequired,
	},
	render () {
		return (
			<div className={container}>
				<div className={header}>
					<div className={title}>{this.props.title}</div>
				</div>
				<div className={body}>
					{this.props.children}
				</div>
			</div>
		)
	},
})

export default WrapperContainer
