const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		DateHelper		= require('./../../helpers/date_helper'),
		Challenges		= require('./challenges');

const ChallengesList = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	componentWillMount: function() {
		const	self = this;

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		self._initBinding();
		self._addListeners();
	},
	_initBinding: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				selectDay	= binding.get('calendar.selectDay');

		if(selectDay !== undefined && selectDay !== null) {
			self._setFixturesByDate(selectDay.date);
		} else {
			binding.set('selectedDayFixtures', Immutable.fromJS([]));
		}
	},
	_addListeners: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.sub('calendar.selectDay').addListener((descriptor) => {
			self._setFixturesByDate(descriptor.getCurrentValue().date);
		});

		binding.sub('models').addListener(() => {
			const currentCalendarDate = binding.toJS('calendar.selectDay');

			currentCalendarDate && self._setFixturesByDate(currentCalendarDate.date);
		});
	},
	_setFixturesByDate:function(date) {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				sync	= binding.toJS('sync') && binding.toJS('sports.sync');
		let		selectedDayFixture = [];

		if(sync) {
			const allFixtures = binding.toJS('models');

			if(allFixtures && allFixtures.length != 0) {

				selectedDayFixture = allFixtures.filter((event) => {
					const eventDate = DateHelper.getDateStringFromDateObject(new Date(event.startTime)),
						currentDate = DateHelper.getDateStringFromDateObject(date);

					return currentDate == eventDate;
				});
			}
		}

		binding.set('selectedDayFixtures', Immutable.fromJS(selectedDayFixture));
	},
	_onClickEvent: function(eventId) {
		document.location.hash = 'event/' + eventId + '?tab=gallery';
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				isSync			= binding.toJS('sync'),
				selectedDay		= binding.get('calendar.selectDay'),
				isDaySelected	= typeof selectedDay !== 'undefined' || selectedDay !== null,
				events			= binding.toJS('selectedDayFixtures');

		return (
			<Challenges
				isSync			= { isSync }
				isDaySelected	= { isDaySelected }
				activeSchoolId	= { this.activeSchoolId }
				onClick			= { this._onClickEvent }
				events			= { events }
			/>
		);
	}
});

module.exports = ChallengesList;