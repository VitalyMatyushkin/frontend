const ClubsConst = require('module/helpers/consts/clubs');
const EventConsts = require('module/helpers/consts/events');

const ClubsHeper = {
	redirectToClubListPage: function () {
		document.location.hash = 'clubs/clubList';
	},
	convertClientToServerFormData: function(data, clubsFormPageData) {
		data.maxParticipants = Number(data.maxParticipants);

		data.ages = clubsFormPageData.ages;
		data.sport = clubsFormPageData.sport;
		data.price = {
			price:		data.price,
			priceType:	ClubsConst.CLIENT_TO_SERVER_PRICING_MAPPING[data.priceType]
		};
		data.schedule = {
			scheduleType:	'WEEKLY_SCHEDULE',
			startDate:		clubsFormPageData.startDate,
			finishDate:		clubsFormPageData.finishDate,
			time:			clubsFormPageData.time,
			days:			this.convertWeekDaysFromClientToServer(clubsFormPageData.days)
		};
		data.gender = EventConsts.MAP_CLIENT_TO_SERVER_EVENT_GENDERS[clubsFormPageData.gender];
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