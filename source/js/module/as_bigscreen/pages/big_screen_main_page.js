const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),

		RecentEvents		= require('./recent_events'),
		UpcomingEvents		= require('./upcoming_events'),
		EventHighlight		= require('./event_highlight'),
		BigEventHighlight	= require('./big_event_highlight'),

		BigScreenActions	= require('./../actions/BigScreenActions'),

		BigscreenConsts		= require('./consts/consts');

const BigScreenMainPage = React.createClass({
	mixins: [Morearty.Mixin],

	changeStateTimerId				: undefined,
	CHANGE_STATE_INTERVAL			: 10000,

	changeFooterEventTimerId		: undefined,
	CHANGE_FOOTER_EVENT_INTERVAL	: 3000,

	componentWillMount: function () {
		const	binding			= this.getDefaultBinding().sub('events');

		BigScreenActions.setSchoolId(binding);
		this.changeStateTimerId = setInterval(this.handleChangeState, this.CHANGE_STATE_INTERVAL);

		binding.set("footerEvents.currentEventIndex", Immutable.fromJS(this.getNextFooterEventIndex()));
		this.changeFooterEventTimerId = setInterval(this.handleChangeFooterEvent, this.CHANGE_FOOTER_EVENT_INTERVAL);
	},
	componentWillUnmount: function () {
		clearInterval(this.changeStateTimerId);
		clearInterval(this.changeFooterEventTimerId);
	},

	getNextFooterEventIndex: function() {
		const binding = this.getDefaultBinding().sub('events.footerEvents');

		const	events				= binding.toJS('events'),
				currentEventIndex	= binding.toJS('currentEventIndex');

		switch (true) {
			case events.length === 0:
				return undefined;
			case currentEventIndex === 'undefined':
				return 0;
			case currentEventIndex === events.length - 1:
				return 0;
			default:
				return currentEventIndex + 1;
		}
	},
	handleChangeFooterEvent: function() {
		this.getDefaultBinding().set(
			'events.footerEvents.currentEventIndex',
			Immutable.fromJS(this.getNextFooterEventIndex())
		);
	},
	handleChangeState: function() {
		const binding = this.getDefaultBinding(),
			newActiveSchoolId = this.getDefaultBinding().sub('events').toJS('domainSchoolId');

		switch (binding.toJS('currentState')) {
			case BigscreenConsts.BIGSCREEN_STATES_MODE.RECENT:
				binding.set('currentState', Immutable.fromJS(BigscreenConsts.BIGSCREEN_STATES_MODE.UPCOMING));
				break;
			case BigscreenConsts.BIGSCREEN_STATES_MODE.UPCOMING:
			 	binding.set('currentState', Immutable.fromJS(BigscreenConsts.BIGSCREEN_STATES_MODE.EVENT_HIGHLIGHT));
				break;
			case BigscreenConsts.BIGSCREEN_STATES_MODE.EVENT_HIGHLIGHT:
				BigScreenActions.setHighlightEvent(newActiveSchoolId, binding.sub('events'));
				binding.set('currentState', Immutable.fromJS(BigscreenConsts.BIGSCREEN_STATES_MODE.HIGHLIGHT));
				break;
			case BigscreenConsts.BIGSCREEN_STATES_MODE.HIGHLIGHT:
				binding.set('currentState', Immutable.fromJS(BigscreenConsts.BIGSCREEN_STATES_MODE.RECENT));
				break;
		};
	},

	render: function() {
		const binding = this.getDefaultBinding();
		const newActiveSchoolId = this.getDefaultBinding().sub('events').toJS('domainSchoolId');

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