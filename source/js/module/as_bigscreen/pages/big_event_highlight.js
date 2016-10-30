const	React				= require('react'),
		Morearty			= require('morearty'),

		BigHighlightsPhoto	= require('./highlights_foto/big_highlights_photo'),
		Footer				= require('./footer');

const BigEventHighlight = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const	binding			= this.getDefaultBinding().sub('events');

		const	isSync 			= binding.get('highlightEvent.isSync') && binding.get('nextSevenDaysEvents.isSync');

		if(isSync) {
			const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
					photos			= binding.toJS('highlightEvent.photos'),
					footerEvent		= binding.toJS('nextSevenDaysEvents.events.0');

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