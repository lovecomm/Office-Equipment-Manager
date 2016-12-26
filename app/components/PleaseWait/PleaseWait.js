import React, { PropTypes } from 'react'
import { pleaseWait } from './styles.scss';

export default function PleaseWait (props) {
	return (
		<div className={pleaseWait}>
			<h3>Uploading data...</h3>
			<p>This may take a minute or so, depending on your connection and the amount of data you're importing.</p>
		</div>
	)
}
