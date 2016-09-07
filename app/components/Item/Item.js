import React, { PropTypes } from 'react'
import { Avatar, IconButton } from 'react-toolbox/lib'
import { item, edit, name, hardware, leftSide, avatar, small, col1, statusWarning, statusReplace } from './styles.scss'

Item.PropTypes = {
	serial: PropTypes.string.isRequired,
	person: PropTypes.object.isRequired,
	hardware: PropTypes.object.isRequired,
	notes: PropTypes.string.isRequired,
	photo: PropTypes.object.isRequired,
	purchasedAtDate: PropTypes.string.isRequired,
	getStatus: PropTypes.string.isRequired,
	getYearsOld: PropTypes.string.isRequired,
}

export default function Item ({serial, hardware, person, notes, photo, purchasedAtDate, getStatus, getYearsOld}) {
	return (
		<li className={item}>
			<div className={leftSide}>
				<div className={col1}>
					<Avatar className={avatar}><img src={hardware.photo.url} /></Avatar>
					<span className={small}>{'#'}{serial}</span>
				</div>
				<div>
					<span className={name}>{person.firstName} {person.lastName}</span>
					<br />
					<span className={hardware}>{hardware.make} {hardware.model}</span>
					<br />
					<div>
						<span className={small}>{purchasedAtDate}</span>
						{getStatus === 'warning'
							? <div><span className={statusWarning}>{'This was purchased more than '}{getYearsOld}{' years ago. If it\'s a computer, you should think about replacing it soon'}</span></div>
							: ''}
						{getStatus === 'replace'
							? <div><span className={statusReplace}>{'This was purchased more than '}{getYearsOld}{' years ago. If it\'s a computer, It needs to be replaced!'}</span></div>
							: ''}
					</div>
				</div>
			</div>
			<IconButton icon='edit' className={edit} accent={true} />
		</li>
	)
}
