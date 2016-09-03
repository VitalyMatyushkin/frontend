const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		ChallengeModel	= require('module/ui/challenges/challenge_model'),
		ChallengeListTitle	= require('./challenge_list_title'),
		ChallengeListItem	= require('./challenge_list_item'),
		NoResultItem		= require('./no_result_item');

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
					const eventDate = new Date(event.startTime).toLocaleDateString(),
						currentDate = date.toLocaleDateString();

					return currentDate == eventDate;
				});
			}
		}

		binding.set('selectedDayFixtures', Immutable.fromJS(selectedDayFixture));
	},
	_onClickEvent: function(eventId) {
		document.location.hash = 'event/' + eventId + '?tab=teams';
	},
	_getEvents: function () {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				currentDate	= binding.get('calendar.currentDate'),
				selectDay	= binding.get('calendar.selectDay'),
				sync		= binding.toJS('sync');

		const events = binding.toJS('selectedDayFixtures');

		switch (true) {
			/* when no day selected */
			case typeof selectDay === 'undefined' || selectDay === null:
				return <NoResultItem text="Please select day"/>;
			/* when data is still loading */
			case !self._isSync():
				return <NoResultItem text="Loading..."/>;
			/* when there are some events */
			case Array.isArray(events) && events.length > 0:		// actually it shouldn't be an array, but Immutable.List instead... but this is what we get from binding
				return events.map( event =>  {
					const	model = new ChallengeModel(event, self.activeSchoolId);
					return <ChallengeListItem key={event.id} event={event} model={model} activeSchoolId={this.activeSchoolId} onClick={this._onClickEvent}/>;
				});
			default:
				return <NoResultItem text="There are no events for selected day"/>;
		}
	},
	_isSync: function() {
		return this.getDefaultBinding().toJS('sync');
	},
	render: function() {
		const	self	= this;

		return (
			<div className="eEvents_challenges mGeneral">
				<ChallengeListTitle/>
				{self._getEvents()}
			</div>
		);
	}
});

module.exports = ChallengesList;