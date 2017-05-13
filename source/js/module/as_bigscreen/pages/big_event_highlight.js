const	React				= require('react'),
		Morearty			= require('morearty'),

		BigHighlightsPhoto	= require('./highlights_foto/big_highlights_photo'),
		Footer				= require('./footer');

const BigEventHighlight = React.createClass({
	mixins: [Morearty.Mixin],

	getCurrentFooterEvent: function() {
		const binding = this.getDefaultBinding().sub('events.footerEvents');

		const	currentEventIndex	= binding.toJS('currentEventIndex'),
				events				= binding.toJS('events');

		return events[currentEventIndex];
	},

	render: function() {
		const	binding	= this.getDefaultBinding().sub('events');

		const	isSync	= binding.get('lastFiveEvents.isSync') && binding.get('footerEvents.isSync');

		if(isSync) {
			const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
					photos			= typeof binding.toJS('lastFiveEvents.photos') !== 'undefined' ? binding.toJS('lastFiveEvents.photos') : [],
					footerEvent		= this.getCurrentFooterEvent();

			return (
				<div className="bEventHighlight">
					<BigHighlightsPhoto photos={photos}/>
					<Footer	activeSchoolId	= { activeSchoolId }
							event			= { footerEvent }
					/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = BigEventHighlight;