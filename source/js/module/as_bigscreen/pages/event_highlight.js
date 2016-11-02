const	React				= require('react'),
		Morearty			= require('morearty'),

		DefaultTitle		= require('./default_header'),
		BigFixtureItem		= require('./fixture_list/fixture_items/big_fixture_item'),
		HighlightsPhoto		= require('./highlights_foto/highlights_photo'),
		Footer				= require('./footer');

const EventHighlight = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const	binding			= this.getDefaultBinding().sub('events');

		const	isSync			= binding.get('highlightEvent.isSync') && binding.get('footerEvents.isSync');

		if(isSync) {
			const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
					event			= binding.toJS('highlightEvent.event'),
					photos			= binding.toJS('highlightEvent.photos'),
					footerEvents		= binding.toJS('footerEvents.events');

			return (
				<div className="bEventHighlight">
					<div className="eEventHighlight_header">
					<DefaultTitle title={"Event Highlight"}/>
					<div className="eEventHighlight_body">
						<BigFixtureItem	activeSchoolId	= { activeSchoolId }
										event			= { event }
						/>
					</div>
					</div>
					<div className="eEventHighlight_footer">
						<HighlightsPhoto photos={ photos }/>
					</div>
					<Footer	activeSchoolId	= { activeSchoolId }
							events			= { footerEvents }
					/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = EventHighlight;