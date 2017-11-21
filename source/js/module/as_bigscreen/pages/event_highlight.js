const	React				= require('react'),
		Morearty			= require('morearty'),

		DefaultTitle		= require('./default_header'),
		BigFixtureItem		= require('./fixture_list/fixture_items/big_fixture_item'),
		HighlightsPhoto		= require('./highlights_foto/highlights_photo'),
		Footer				= require('./footer');

const EventHighlight = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		eventData: React.PropTypes.object.isRequired
	},
	getCurrentFooterEvent: function() {
		const binding = this.getDefaultBinding().sub('events.footerEvents');

		const	currentEventIndex	= binding.toJS('currentEventIndex'),
				events				= binding.toJS('events');

		return events[currentEventIndex];
	},

	render: function() {
		const binding = this.getDefaultBinding().sub('events');
		const eventData = this.props.eventData;
		const isSync = eventData.isSync && binding.get('footerEvents.isSync');

		if(isSync) {
			const	newActiveSchoolId	= this.getDefaultBinding().sub('events').toJS('domainSchoolId'),
					event				= eventData.event,
					photos				= eventData.photos,
					footerEvent			= this.getCurrentFooterEvent();

			return (
				<div className="bEventHighlight">
					<div className="eEventHighlight_header">
					<DefaultTitle title={"Event Highlight"} logo={"images/big-logo.svg"}/>
					<div className="eEventHighlight_body">
						<BigFixtureItem
							activeSchoolId	= { newActiveSchoolId }
							event			= { event }
						/>
					</div>
					</div>
					<div className="eEventHighlight_footer">
						<HighlightsPhoto
							eventId	= { event.id }
							photos	= { photos }
						/>
					</div>
					<Footer
						activeSchoolId	= { newActiveSchoolId }
						event			= { footerEvent }
					/>
				</div>
			);
		} else {
			const	newActiveSchoolId = this.getDefaultBinding().sub('events').toJS('domainSchoolId'),
					footerEvent		= this.getCurrentFooterEvent();

			return (
				<div className="bEventHighlight">
					<div className="eEventHighlight_header">
						<DefaultTitle title={"Event Highlight"} logo={"images/big-logo.svg"}/>
					</div>
					<div className="eEventHighlight_footer">
						<Footer	activeSchoolId	= { newActiveSchoolId }
								event			= { footerEvent }
						/>
					</div>
				</div>
		);
		}
	}
});

module.exports = EventHighlight;