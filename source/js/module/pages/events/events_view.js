var CalendarView = require('./events_calendar'),
	EventsChallengesView = require('./events_challenges'),
	InvitesView = require('./events_invites'),
	EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var date = new Date();

		return Immutable.fromJS({
            models: [],
            activeList: 'calendar',
            _calendar: {
                currentDate: date,
                mode: 'months'
            },
			invites: {
				models: []
			}
		});
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding();

		window.Server.events.get().then(function (data) {
			binding.set('models', Immutable.fromJS(data));
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			activeList = binding.get('activeList'),
			currentView;

		if (activeList === 'calendar') {
			currentView =  <CalendarView binding={binding.sub('_calendar')} />
		} else if (activeList === 'challenges') {
			currentView =  <EventsChallengesView binding={binding} />
		} else if (activeList === 'invites') {
			currentView =  <InvitesView binding={binding} />
		} else if (activeList === 'newChallenge') {
			currentView =  <InvitesView binding={binding} />
		}

		return <div className="bEvents">
			<div className="eEvents_topPanel">
				<div className="eTopInfoBlock mMyEvent">
					<span className="eTopInfoBlock_count">243</span>
					<span className="eTopInfoBlock_title">Calendar</span>
					<span className="eTopInfoBlock_action">overview</span>
				</div>
				<div className="eTopInfoBlock mNewEvent">
					<span className="eTopInfoBlock_count">243</span>
					<span className="eTopInfoBlock_title">Chellenges</span>
					<span className="eTopInfoBlock_action">overview</span>
				</div>
				<div className="eTopInfoBlock mMyInvite">
					<span className="eTopInfoBlock_count">243</span>
					<span className="eTopInfoBlock_title">Invites</span>
					<span className="eTopInfoBlock_action">overview</span>
				</div>
				<div className="eTopInfoBlock mListEvent">
					<span className="eTopInfoBlock_count"></span>
					<span className="eTopInfoBlock_title">New Challenge</span>
					<span className="eTopInfoBlock_action">overview</span>
				</div>
			</div>
			{currentView}
		</div>
	}
});


module.exports = EventsView;
