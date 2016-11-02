const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),

		RecentEvents		= require('./recent_events'),
		UpcomingEvents		= require('./upcoming_events'),
		EventHighlight		= require('./event_highlight'),
		BigEventHighlight	= require('./big_event_highlight'),

		BigScreenActions	= require('./../actions/BigScreenActions'),
		CalendarActions		= require('./../../as_school/pages/school_home/CalendarActions'),

		BigscreenConsts		= require('./consts/consts');

const BigScreenMainPage = React.createClass({
	mixins: [Morearty.Mixin],

	timerId: undefined,
	CHANGE_STATE_INTERVAL: 10000,

	componentWillMount: function () {
		const	binding			= this.getDefaultBinding().sub('events'),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId');

		CalendarActions.setNextSevenDaysEvents(activeSchoolId, binding);
		CalendarActions.setPrevSevenDaysFinishedEvents(activeSchoolId, binding);
		BigScreenActions.setHighlightEvent(activeSchoolId, binding);

		this.timerId = setInterval(this.handleChangeState, this.CHANGE_STATE_INTERVAL);
	},
	componentWillUnmount: function () {
		clearInterval(this.timerId);
	},
	handleChangeState: function() {
		const binding = this.getDefaultBinding();

		switch (binding.toJS('currentState')) {
			case BigscreenConsts.BIGSCREEN_STATES_MODE.RECENT:
				binding.set('currentState', Immutable.fromJS(BigscreenConsts.BIGSCREEN_STATES_MODE.UPCOMING));
				break;
			case BigscreenConsts.BIGSCREEN_STATES_MODE.UPCOMING:
				binding.set('currentState', Immutable.fromJS(BigscreenConsts.BIGSCREEN_STATES_MODE.EVENT_HIGHLIGHT));
				break;
			case BigscreenConsts.BIGSCREEN_STATES_MODE.EVENT_HIGHLIGHT:
				binding.set('currentState', Immutable.fromJS(BigscreenConsts.BIGSCREEN_STATES_MODE.HIGHLIGHT));
				break;
			case BigscreenConsts.BIGSCREEN_STATES_MODE.HIGHLIGHT:
				binding.set('currentState', Immutable.fromJS(BigscreenConsts.BIGSCREEN_STATES_MODE.RECENT));
				break;
		};
	},

	render: function() {
		const binding = this.getDefaultBinding();

		switch (binding.toJS('currentState')) {
			case BigscreenConsts.BIGSCREEN_STATES_MODE.RECENT:
				return (
					<div className="bBigScreen">
						<RecentEvents binding={binding}/>
					</div>
				);
			case BigscreenConsts.BIGSCREEN_STATES_MODE.UPCOMING:
				return (
					<div className="bBigScreen">
						<UpcomingEvents binding={binding}/>
					</div>
				);
			case BigscreenConsts.BIGSCREEN_STATES_MODE.EVENT_HIGHLIGHT:
				return (
					<div className="bBigScreen">
						<EventHighlight binding={binding}/>
					</div>
				);
			case BigscreenConsts.BIGSCREEN_STATES_MODE.HIGHLIGHT:
				return (
					<div className="bBigScreen">
						<BigEventHighlight binding={binding}/>
					</div>
				);
		};
	}
});

module.exports = BigScreenMainPage;