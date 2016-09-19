const	React			= require('react'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		DateHelper		= require('./../../../../helpers/date_helper'),
		Sport			= require('module/ui/icons/sport_icon');

const AllChallengesList = React.createClass({
	mixins:[Morearty.Mixin,InvitesMixin],
	componentWillMount: function() {
		const	self	= this;

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
				binding	= self.getDefaultBinding();
		let		selectedDayFixture = [];

		if(self._isSync()) {
			const allFixtures = binding.toJS('models');

			if(allFixtures && allFixtures.length != 0) {
				selectedDayFixture = allFixtures.filter((event) => {
					const	eventDate	= DateHelper.getDateStringFromDateObject(new Date(event.startTime)),
							currentDate	= DateHelper.getDateStringFromDateObject(date);

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
	_renderEvent: function () {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				selectDay		= binding.get('calendar.selectDay'),
				childrenOfUser	= binding.get('children');
		let		result;

		if(selectDay === undefined || selectDay === null) {
			result = (
				<div className="eChallenge mNotFound">{"Please select day."}</div>
			);
		} else if(self._isSync() && childrenOfUser && childrenOfUser.count()) {
			const fixtures = childrenOfUser.map(self._renderChildEvents).toArray().filter((fixture) => {
				return fixture !== null;
			});

			if(fixtures.length === 0) {
				result = (
					<div className="eChallenge mNotFound">{"There are no events for selected day."}</div>
				);
			} else {
				result = fixtures;
			}
		} else {
			result = (
				<div className="eChallenge mNotFound">{"Loading..."}</div>
			);
		}

		return result;
	},
	_renderChildEvents: function(child, childInd) {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				events	= binding.get('selectedDayFixtures');

		child.event = events.filter(function(ev){
			return ev.get('childId') === child.get('id');
		});

		if(child.event.count()) {
			//Iterate over the children present in the bag
			const	childFixtures	= child.event.map(self._renderChildEvent).toArray();

			return (
				<div key={childInd} className= "eChallenge eChallenge_all">
					<div className="eChildFixturesAll"> {childFixtures}</div>
					<div className="eChallenge_childName">{`${child.get('firstName')} ${child.get('lastName')}`}</div>
				</div>
			);
		} else {
			return null;
		}
	},
	_renderChildEvent: function(childEv, childEvInd) {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				hoverDay	= binding.get('calendar.hoverDay') && binding.get('calendar.hoverDay').date,
				stringDate	= self.formatDate(childEv.get('startTime')),
				sport		= self._getSportIcon(childEv.get('sport').get('name'));

		return(
			<div key={childEvInd} className={'eChallenge eChallenge_basicMod'} onClick={self._onClickEvent.bind(null, childEv.get('id'))}>
				<span className="eChallenge_sport">{sport}</span>
				<span className="eChallenge_date">{stringDate}</span>
				<div className="eChallenge_name" title={childEv.get('name')}>{childEv.get('name')}</div>
			</div>
		);
	},
	_isSync: function() {
		const	self	= this;

		return self.getDefaultBinding().toJS('sync');
	},
	render: function() {
		const	self	= this;

		return (
			<div className="eEvents_challenges mChildrenNames">
				<div className="eChallenge_title">
					<div className="eChildFixturesAll">
						<span className="eChallenge_sport">Sport</span>
						<span className="eChallenge_date">Date</span>
						<span className="eChallenge_name">Event Name</span>
					</div>
						<span className="eChallenge_childName">Name</span>
				</div>
				{self._renderEvent()}
			</div>
		);
	}
});

module.exports = AllChallengesList;