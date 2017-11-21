const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	PrealoadImages			= require('./preload_images'),
		RecentEvents			= require('./recent_events'),
		UpcomingEvents			= require('./upcoming_events'),
		HighlightEventCarousel	= require('./highlight_event_carousel'),
		BigEventHighlight		= require('./big_event_highlight'),
		BigScreenActions		= require('./../actions/BigScreenActions'),
		BigscreenConsts			= require('./consts/consts');

const BigScreenMainPage = React.createClass({
	mixins: [Morearty.Mixin],

	CHANGE_STATE_INTERVAL			: 10000,
	CHANGE_FOOTER_EVENT_INTERVAL	: 3000,

	componentWillMount: function () {
		const binding = this.getDefaultBinding();
		const eventsBinding = this.getDefaultBinding().sub('events');

		binding.set('isSync', false);
		binding.set('changeStateTimerId', undefined);
		binding.set('changeFooterEventTimerId', undefined);
		BigScreenActions.initialize(eventsBinding).then(() => {
			if(typeof binding.get('changeStateTimerId') === 'undefined') {
				binding.set(
					'changeStateTimerId',
					setInterval(this.handleChangeState, this.CHANGE_STATE_INTERVAL)
				);
			}
			if(typeof binding.get('changeFooterEventTimerId') === 'undefined') {
				binding.set(
					'changeStateTimerId',
					setInterval(this.handleChangeFooterEvent, this.CHANGE_FOOTER_EVENT_INTERVAL)
				);
			}

			eventsBinding.set(
				"footerEvents.currentEventIndex",
				Immutable.fromJS(this.getNextFooterEventIndex())
			);
			binding.set('isSync', true);
		});
	},
	componentWillUnmount: function () {
		const binding = this.getDefaultBinding();

		clearInterval(binding.get('changeStateTimerId'));
		clearInterval(binding.get('changeFooterEventTimerId'));
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
	setNextHighlightEventIndex: function () {
		const eventsBinding = this.getDefaultBinding().sub('events');

		const events = eventsBinding.toJS('highlightEvents.events');
		let currentIndex = eventsBinding.toJS('highlightEvents.currentIndex');


		if(currentIndex === events.length - 1) {
			currentIndex = 0;
		} else {
			currentIndex++;
		}

		eventsBinding.set('highlightEvents.currentIndex', currentIndex);
	},
	handleChangeFooterEvent: function() {
		this.getDefaultBinding().set(
			'events.footerEvents.currentEventIndex',
			Immutable.fromJS(this.getNextFooterEventIndex())
		);
	},
	handleChangeState: function() {
		const binding = this.getDefaultBinding();
		const currentState = binding.toJS('currentState');

		switch (currentState) {
			case BigscreenConsts.BIGSCREEN_STATES_MODE.RECENT:
				this.setNextHighlightEventIndex();
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
		}
	},
	renderMainView: function () {
		const binding = this.getDefaultBinding();
		const currentState = binding.toJS('currentState');

		return (
			<div className="bBigScreen">
				<PrealoadImages
					binding	= { binding }
				/>
				<RecentEvents
					binding	= { binding }
					isShow	= { BigscreenConsts.BIGSCREEN_STATES_MODE.RECENT === currentState }
				/>
				<UpcomingEvents
					binding	= { binding }
					isShow	= { BigscreenConsts.BIGSCREEN_STATES_MODE.UPCOMING === currentState }
				/>
				<HighlightEventCarousel
					binding	= { binding }
					isShow	= { BigscreenConsts.BIGSCREEN_STATES_MODE.EVENT_HIGHLIGHT === currentState }
				/>
				<BigEventHighlight
					binding	= { binding }
					isShow	= { BigscreenConsts.BIGSCREEN_STATES_MODE.HIGHLIGHT === currentState }
				/>
			</div>
		);
	},
	renderLoader: function () {
		return (
			<div className="bEventContainer mTopMargin">
				<span className="eEvent_loading">
					Loading...
				</span>
			</div>
		);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		let content = null;
		if(binding.toJS('isSync')) {
			content = this.renderMainView();
		} else {
			content = this.renderLoader();
		}

		return content;
	}
});

module.exports = BigScreenMainPage;