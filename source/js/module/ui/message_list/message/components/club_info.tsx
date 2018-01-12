import * as React from 'react';
import * as ClubsConst from 'module/helpers/consts/clubs';
import { DateHelper } from 'module/helpers/date_helper';
import * as propz from "propz";

const InviteStyles = require('styles/pages/events/b_invite.scss');

export enum MembersOfStaffTypes {
	Coach = 'COACH',
	MemberOfStaff = 'MEMBER_OF_STAFF'
}

export interface ClubInfoProps {
	message: any
}

export class ClubInfo extends React.Component<ClubInfoProps, {}> {
	getClub() {
		return this.props.message.clubData;
	}

	getStartDate(): string {
		const club = this.getClub();

		return DateHelper.toLocalWithMonthName(club.startDate);
	}

	getEndDate(): string {
		const club = this.getClub();

		return DateHelper.toLocalWithMonthName(club.finishDate);
	}

	getFullName() {
		const firstName = propz.get(this.props.message, ['playerDetailsData', 'firstName'], undefined);
		const lastName = propz.get(this.props.message, ['playerDetailsData', 'lastName'], undefined);

		return `${firstName}  ${lastName}`;
	}

	renderMembersOfStuff(membersOfStaffType: MembersOfStaffTypes) {
		const club = this.getClub();

		let result = null;

		if (
			club.staff.length > 0 &&
			club.staff.filter(staff => staff.staffRole === membersOfStaffType).length > 0
		) {
			result = (
				<div className="eClubParticipationMessage_membersOfStaff">
					<span className='eClubParticipationMessage_boldTag'>
						{
							`${ membersOfStaffType === MembersOfStaffTypes.MemberOfStaff ? 'Members of staff: ' : 'Coach: '}`
						}
					</span>
					{
						club.staff.filter(staff => staff.staffRole === membersOfStaffType)
							.map(staff => `${staff.firstName} ${staff.lastName}`)
							.join(', ')
					}
				</div>
			);
		} else {
			result = null;
		}

		return result;
	}

	renderDescription() {
		const description = this.getClub().description;

		let result = null;
		if(description !== '') {
			result = (
				<div className="eClubParticipationMessage_description">
					<span className='eClubParticipationMessage_boldTag'>Description:</span> {description}
				</div>
			);
		}

		return result;
	}

	getWeekDays() {
		return this.getClub().days.map(d => ClubsConst.WEEK_DAYS_MAP[d]).join(', ');
	}

	getEventTime() {
		const startDate = this.getClub().time;
		const startDateTimeStamp = new Date(startDate).getTime();
		const endDateTimeStamp = startDateTimeStamp + this.getClub().duration * 60 * 1000;
		const endDate = new Date(endDateTimeStamp);

		const startTime = DateHelper.getTime(startDate);
		const endTime = DateHelper.getTime(endDate);


		return `${startTime}-${endTime}`
	}

	getTime() {
		const club = this.getClub();

		let time = null;
		switch (true) {
			case this.getStartDate() === this.getEndDate(): {
				time = this.getEventTime();
				break;
			}
			default: {
				time = ` ${this.getWeekDays()}; ${this.getEventTime()}`;
				break;
			}
		}

		return time;
	}

	render() {
		return (
			<div className="eClubParticipationMessage_content">
				<div className="eClubParticipationMessage_time">
					<span className='eClubParticipationMessage_boldTag'>Time:</span>{this.getTime()}
				</div>
				{ this.renderMembersOfStuff(MembersOfStaffTypes.Coach) }
				{ this.renderMembersOfStuff(MembersOfStaffTypes.MemberOfStaff) }
				{ this.renderDescription() }

				<div className='eClubParticipationMessage_text'>
					<h4>
						To reserve a place for {this.getFullName()}, click the 'Book now' bellow button
					</h4>
				</div>
			</div>
		);
	}
}