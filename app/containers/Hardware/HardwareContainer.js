import React from 'react'
import { Hardware, HardwareToolbar } from 'components'

const HardwareContainer = React.createClass({
	render () {
		return (
			<div>
				<HardwareToolbar />
				<Hardware />
			</div>
		)
	},
})

export default HardwareContainer
