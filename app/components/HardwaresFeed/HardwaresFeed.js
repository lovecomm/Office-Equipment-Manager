import React, { PropTypes } from 'react'
import { HardwareFormToggleContainer, HardwareContainer, HardwaresFilterContainer, HardwaresSortMenuContainer } from 'containers'
import { ActionBar } from 'components'
import { list } from 'sharedStyles/layout'

HardwaresFeed.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	hardwaresFeed: PropTypes.object.isRequired,
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
					return props.hardwaresFeed.feedIds.map((id) => (
						<HardwareContainer
							hardwareId={id}
							key={id} />
					))
				})()}
			</div>
		</div>
}
