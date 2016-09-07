import React, { PropTypes } from 'react'
import { Avatar, IconButton, Chip } from 'react-toolbox/lib'
import { item, edit, name, hardware, leftSide, avatar, small, col1, statusWarning, statusReplace, status } from './styles.scss'

Item.PropTypes = {
	serial: PropTypes.string.isRequired,
	person: PropTypes.object.isRequired,
	hardware: PropTypes.object.isRequired,
	notes: PropTypes.string.isRequired,
	photo: PropTypes.object.isRequired,
	purchasedAtDate: PropTypes.string.isRequired,
	getYearsOld: PropTypes.string.isRequired,
}

export default function Item ({serial, hardware, person, notes, photo, purchasedAtDate, getYearsOld}) {
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
						<br />
						<div className={status}>
							{(() => {
								// Calculating Item's status
								if (hardware.isComputer === true) {
									if (getYearsOld >= '5') {
										return (<span className={statusReplace}>This computer was purchased more than {getYearsOld} years ago. It needs to be replaced!</span>)
									} else if (getYearsOld >= '3') {
										return (<span className={statusWarning}>This computer was purchased more than {getYearsOld} years ago. You should think about replacing it soon.</span>)
									} else if (getYearsOld >= '1') {
										return (<span className={small}>This computer was purchased more than {getYearsOld} year(s) ago.</span>)
									} else {
										return (<span className={small}>This computer was purchased less than a year ago.</span>)
									}
								} else if (getYearsOld >= '1') {
									return (<span className={small}>This item was purchased more than {getYearsOld} year(s) ago.</span>)
								} else {
									return (<span className={small}>This item was purchased less than a year ago.</span>)
								}
							})()}
						</div>
					</div>
				</div>
			</div>
			<IconButton icon='edit' className={edit} />
		</li>
	)
}
