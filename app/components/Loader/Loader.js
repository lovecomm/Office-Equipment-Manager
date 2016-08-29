import React from 'react'
import { ProgressBar } from 'react-toolbox/lib'

const styles = {
	wrapper: {
		position: 'relative',
		width: '65%',
		maxHeight: '100%',
		margin: '25% auto 0',
	},
	indicator: {
		position: 'absolute',
		margin: 'auto',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		width: '100px',
		height: '100px',
	},
}

export default function Loader () {
	return (
		<div style={styles.wrapper}>
			<ProgressBar type='linear' mode='indeterminate' />
		</div>
	)
}
