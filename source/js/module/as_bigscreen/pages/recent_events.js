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
			bRecentEvents:	true,
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

		const isSync = binding.get('lastFiveEvents.isSync') && binding.get('footerEvents.isSync');

		if(isSync) {
			const	events			= binding.toJS('lastFiveEvents.events'),
					footerEvent		= this.getCurrentFooterEvent(),
					newActiveSchoolId = this.getDefaultBinding().sub('events').toJS('domainSchoolId');

			return (
				<div className = { this.getClassName() }>
					<FixtureList	mode			= { BigScreenConsts.FIXTURE_LIST_MODE.RECENT }
									title			= "Recent results"
									activeSchoolId	= { newActiveSchoolId }
									events			= { events }
									logo            = "images/big-logo.svg"
						/>
					<Footer	event			= { footerEvent }
							activeSchoolId	= { newActiveSchoolId }
					/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = RecentEvent;