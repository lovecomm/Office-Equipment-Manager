import React, { PropTypes } from 'react'
import { ItemContainer, PersonContainer, HardwareContainer, ToolbarContainer } from 'containers'
import { list } from './styles.scss'

Feed.propTypes = {
	activeView: PropTypes.string.isRequired,
	itemIds: PropTypes.array.isRequired,
	personIds: PropTypes.array.isRequired,
	hardwareIds: PropTypes.array.isRequired,
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
}

export default function Feed (props) {
	return props.isFetching === true
		? <h3 style={{textAlign: 'center', marginTop: '25%'}}>{'Getting your items...'}</h3>
		: <div>
			<ToolbarContainer activeView={props.activeView}/>
			<div className={list}>
				{(() => {
					switch (props.activeView) {
					case '/':
						return props.itemIds.map((id) => (
							<ItemContainer
								itemId={id}
								key={id} />
						))
					case '/people':
						return props.personIds.map((id) => (
							<PersonContainer
								personId={id}
								key={id} />
						))
					case '/hardware':
						return props.hardwareIds.map((id) => (
							<HardwareContainer
								hardwareId={id}
								key={id} />
						))
					}
				})()}
			</div>
		</div>
}
