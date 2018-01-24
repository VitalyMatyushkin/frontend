const ClubsConst = require('module/helpers/consts/clubs');
const EventConsts = require('module/helpers/consts/events');

const ClubsHeper = {
	redirectToClubListPage: function () {
		document.location.hash = 'clubs/clubList';
	},

	/**
	 * Function converts data from club form and some additional data to server type form
	 * @param data - main data from club form
	 * @param clubsFormPageData - additional data from club form
	 * @returns {{} & any}
	 */
	convertClientToServerFormData: function(data, clubsFormPageData) {
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
	getWeekDays: function () {
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
	convertWeekDaysFromServerToClient: function (weekDays) {
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
	convertWeekDaysFromClientToServer: function (weekDays) {
		return weekDays.map(d => d.id);
	}
};

module.exports = ClubsHeper;