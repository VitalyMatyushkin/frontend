import * as ClubsConst from 'module/helpers/consts/clubs'
import * as EventConsts from 'module/helpers/consts/events'
import {WeekDay} from "module/as_manager/pages/clubs/club_form/club_form";

export const ClubsHelper = {
	redirectToClubListPage() {
		document.location.hash = 'clubs/clubList';
	},

	redirectToClubStudentEditPage(clubId) {
		document.location.hash = 'clubs/editChildren?id=' + clubId;
	},

	/**
	 * Function converts data from club form and some additional data to server type form
	 * @param data - main data from club form
	 * @param clubsFormPageData - additional data from club form
	 * @returns {{} & any}
	 */
	convertClientToServerFormData(data, clubsFormPageData) {
		const cpData = Object.assign({}, data);

		cpData.maxParticipants = Number(cpData.maxParticipants);

		cpData.ages = clubsFormPageData.ages;
		cpData.sport = clubsFormPageData.sport;
		cpData.price = {
			price:		cpData.price,
			priceType:	ClubsConst.CLIENT_TO_SERVER_PRICING_MAPPING[cpData.priceType]
		};
		cpData.schedule = {
			scheduleType:	'WEEKLY_SCHEDULE',
			startDate:		clubsFormPageData.startDate,
			finishDate:		clubsFormPageData.finishDate,
			time:			clubsFormPageData.time,
			days:			this.convertWeekDaysFromClientToServer(clubsFormPageData.days),
			duration:		Number(cpData.duration)
		};
		delete cpData.duration;
		cpData.gender = EventConsts.MAP_CLIENT_TO_SERVER_EVENT_GENDERS[clubsFormPageData.gender];
		cpData.staff 	= clubsFormPageData.staff;

		return cpData;
	},
	getWeekDays(): WeekDay[] {
		return [
			{id:'MONDAY', value: 'Monday'},
			{id:'TUESDAY', value: 'Tuesday'},
			{id:'WEDNESDAY', value: 'Wednesday'},
			{id:'THURSDAY', value: 'Thursday'},
			{id:'FRIDAY', value: 'Friday'},
			{id:'SATURDAY', value: 'Saturday'},
			{id:'SUNDAY', value: 'Sunday'}
		];
	},
	convertWeekDaysFromServerToClient(weekDays: WeekDay[]): WeekDay[] {
		const allDays = this.getWeekDays();

		let clientWeekDays = [];
		weekDays.forEach(d => {
			const clientDay = allDays.find(_d => _d.id === d);
			if(typeof clientDay !== 'undefined') {
				clientWeekDays.push(clientDay);
			}
		});

		return clientWeekDays;
	},
	convertWeekDaysFromClientToServer(weekDays: WeekDay[]): string[] {
		return weekDays.map(d => d.id);
	}
};