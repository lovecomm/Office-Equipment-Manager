import React from 'react'
import { Link } from 'react-router'
import { container } from './styles.scss'

export default function Logout (props) {
	return (
		<div className={container}>
			<p>You have successfuly signed out.</p>
			<p><Link to='/auth'>Log back in?</Link></p>
		</div>
	)
}
