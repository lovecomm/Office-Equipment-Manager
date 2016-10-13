import React, { PropTypes } from 'react'
import { ProgressBar } from 'react-toolbox/lib'

function styles (props) {
	return {
		position: 'relative',
		width: '65%',
		maxHeight: '100%',
		margin: `${props.marginTop} auto ${props.marginBottom}`,
	}
}

Loader.propTypes = {
	marginTop: PropTypes.string.isRequired,
	marginBottom: PropTypes.string.isRequired,
}

export default function Loader (props) {
	return (
		<div style={(() => styles(props))()}>
			<ProgressBar type='linear' mode='indeterminate' />
		</div>
	)
}
