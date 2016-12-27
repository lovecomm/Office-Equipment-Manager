import React, { PropTypes } from 'react'
import { HardwareFormToggleContainer, HardwareContainer, HardwaresFilterContainer, HardwaresSortMenuContainer } from 'containers'
import { ActionBar } from 'components'
import { list } from 'sharedStyles/layout'

HardwaresFeed.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	hardwares: PropTypes.object.isRequired,
	feedIds: PropTypes.array.isRequired,
}

export default function HardwaresFeed (props) {
	return props.isFetching === true
		? <h3 style={{textAlign: 'center', marginTop: '25%'}}>{'Getting hardware...'}</h3>
		: <div>
			<ActionBar
				newFormToggle={<HardwareFormToggleContainer editing={false} />}
				filter={<HardwaresFilterContainer />}
				sortMenu={<HardwaresSortMenuContainer />}/>
			<div className={list}>
				{(() => {
					return props.feedIds.map((id) => {
						const hardware = props.hardwares[id]
						if (hardware) {
							return ( <HardwareContainer
								hardware={hardware}
								hardwareId={id}
								key={id} />)
						}
					})
				})()}
			</div>
		</div>
}
