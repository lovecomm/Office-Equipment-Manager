import React from 'react'
import { Link } from 'react-router'

export default function Logout (props) {
	return (
		<div>
			<p>You have successfuly signed out.</p>
			<p><Link to='/auth'>Log back in?</Link></p>
		</div>
	)
}
