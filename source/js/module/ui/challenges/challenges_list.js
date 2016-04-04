const	React			= require('react'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		Immutable		= require('immutable'),
		Sport			= require('module/ui/icons/sport_icon'),
        ChallengeModel	= require('module/ui/challenges/challenge_model'),

ChallengesList = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	componentWillMount: function() {
		const	self = this;

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
		document.location.hash = 'event/' + eventId;
	},
	_getSportIcon:function(sport){
		return <Sport name={sport} className="bIcon_invites" ></Sport>;
	},
	_getEvents: function () {
		const	self		    = this,
				binding		    = self.getDefaultBinding(),
                activeSchoolId  = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				currentDate	    = binding.get('calendar.currentDate'),
				selectDay	    = binding.get('calendar.selectDay'),
				sync		    = binding.toJS('sync');
		let		result;

		if(selectDay === undefined || selectDay === null) {
			result = (
				<div className="eChallenge mNotFound">{"Please select day."}</div>
			);
		} else if(!self._isSync()) {
			result = (
				<div className="eChallenge mNotFound">
					{"Loading..."}
				</div>
			);
		} else {
			const events = binding.toJS('selectedDayFixtures');

			if(events.length) {
				result = events.map(function (event) {
					const model = new ChallengeModel(event, activeSchoolId),
						sport = self._getSportIcon(model.sport);

					return (
                    <div key={'event-' + event.id} className='eChallenge' onClick={self._onClickEvent.bind(null, event.id)}>
						<div className="eChallenge_sport">{sport}</div>
						<div className="eChallenge_date">{model.date}</div>

						<div className="eChallenge_name" title={model.name}>{model.name}</div>
						<div className="eChallenge_rivals">
							<span className="eChallenge_rivalName" title={model.rivals[0]}>{model.rivals[0]}</span>
							<span>vs</span>
							<span className="eChallenge_rivalName" title={model.rivals[1]}>{model.rivals[1]}</span>
						</div>
					</div>
                    );
				});
			} else {
				result = (
					<div className="eChallenge mNotFound">
						{"There are no events for selected day."}
					</div>
				);
			}
		}

		return result;
	},
	_isSync: function() {
		const	self	= this;

		return self.getDefaultBinding().toJS('sync');
	},
	render: function() {
		const	self	= this;

		return (
			<div className="eEvents_challenges mGeneral">
				<div className="eChallenge_title">
					<span className="eChallenge_sport">Sport</span>
					<span className="eChallenge_date">Date</span>
					<span className="eChallenge_name">Event Name</span>
					<span className="eChallenge_rivals">Game Type</span>
				</div>
				{self._getEvents()}
			</div>
		);
	}
});

module.exports = ChallengesList;