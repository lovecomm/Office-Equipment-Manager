import React, { PropTypes } from 'react'
import { CircularProgress } from 'material-ui'

const styles = {
	wrapper: {
		position: 'relative',
		height: window.innerHeight,
		width: '100%',
		maxHeight: '100%',
	},
	indicator: {
		position: 'absolute',
		margin: 'auto',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
	},
}

export default function Loader ({size}) {
	return (
		<div style={styles.wrapper}>
			<CircularProgress size={size} style={styles.indicator}/>
		</div>
	)
}

Loader.propTypes = {
	size: PropTypes.number.isRequired,
}
