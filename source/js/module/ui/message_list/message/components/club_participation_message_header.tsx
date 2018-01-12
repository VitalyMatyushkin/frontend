import * as React from 'react';

import { DateHelper } from 'module/helpers/date_helper';
import * as propz from "propz";

const Style = require('styles/ui/b_club_participation_message.scss');

export interface ClubParticipationMessageHeaderProps {
	message: any
}

export class ClubParticipationMessageHeader extends React.Component<ClubParticipationMessageHeaderProps, {}> {
	getClub() {
		return this.props.message.clubData;
	}

	getFullName() {
		const firstName = propz.get(this.props.message, ['playerDetailsData', 'firstName'], undefined);
		const lastName = propz.get(this.props.message, ['playerDetailsData', 'lastName'], undefined);

		return `${firstName}  ${lastName}`;
	}

	getClubName() {
		return this.getClub().name;
	}

	getClubAges(): string {
		const club = this.getClub();

		let result = '';
		if(typeof club.ages !== 'undefined') {
			if(club.ages.length === 0) {
				result = 'All ages';
			} else {
				result = club.ages
					.map(elem => elem === 0 ? 'Reception' : 'Y' + elem)
					.join(", ");
			}
		}

		return result;
	}

	getGender(): string {
		const genders = {
			"MALE_ONLY":	'Boys',
			"FEMALE_ONLY":	'Girls',
			'MIXED':		'Mixed'
		};

		return genders[this.getClub().gender];
	}

	getStartDate(): string {
		const club = this.getClub();

		return DateHelper.toLocalWithMonthName(club.startDate);
	}

	getEndDate(): string {
		const club = this.getClub();

		return DateHelper.toLocalWithMonthName(club.finishDate);
	}

	renderDate() {
		let result = null;
		switch (true) {
			case this.getStartDate() === this.getEndDate(): {
				result = (
					<div className='eClubParticipationMessage_date'>
						<span className='eClubParticipationMessage_boldTag'>Date:</span>{` ${this.getStartDate()}`}
					</div>
				);
				break;
			}
			default: {
				result = (
					<div className='eClubParticipationMessage_date'>
						<span className='eClubParticipationMessage_boldTag'>Start:</span>{` ${this.getStartDate()} `}
						<span className='eClubParticipationMessage_boldTag'>End:</span>{` ${this.getEndDate()}`}
					</div>
				);

				break;
			}
		}

		return result;
	}

	render() {

		return (
			<div className="eClubParticipationMessage_header">
				<h4 className='eClubParticipationMessage_headerText'>
					{`A new opportunity for ${this.getFullName()} is available`}<br/>
					{this.getClubName()}
				</h4>
				<div className='eClubParticipationMessage_gender'>
					{`${this.getGender()}, ${this.getClubAges()}`}
				</div>
				{ this.renderDate() }
			</div>
		);
	}
}