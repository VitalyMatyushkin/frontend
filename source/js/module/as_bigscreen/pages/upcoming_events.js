const	React			= require('react'),
		Morearty		= require('morearty'),

		BigScreenConsts	= require('./consts/consts'),
		FixtureList		= require('./fixture_list/fixture_list'),
		Footer			= require('./footer'),
		classNames		= require('classnames');

const RecentEvent = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isShow: React.PropTypes.bool.isRequired
	},
	getClassName: function () {
		return classNames({
			bUpcomingEvents:	true,
			mDisable:		!this.props.isShow
		});
	},
	getCurrentFooterEvent: function() {
		const binding = this.getDefaultBinding().sub('events.footerEvents');

		const	currentEventIndex	= binding.toJS('currentEventIndex'),
				events				= binding.toJS('events');

		return events[currentEventIndex];
	},

	render:function() {
		const binding = this.getDefaultBinding().sub('events');

		const isSync = binding.get('closestFiveEvents.isSync') && binding.get('footerEvents.isSync');

		if(isSync) {
			const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
					events			= binding.toJS('closestFiveEvents.events'),
					footerEvent		= this.getCurrentFooterEvent();

			return (
				<div className = { this.getClassName() }>
					<FixtureList	mode			= { BigScreenConsts.FIXTURE_LIST_MODE.UPCOMING }
									title			= "Upcoming Events"
									activeSchoolId	= { activeSchoolId }
									isSync			= { isSync }
									events			= { events }
									logo            = "images/big-logo.svg"
					/>
					<Footer	event			= { footerEvent }
							activeSchoolId	= { activeSchoolId }
					/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = RecentEvent;