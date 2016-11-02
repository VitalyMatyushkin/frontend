const	React				= require('react'),
		Morearty			= require('morearty'),

		BigHighlightsPhoto	= require('./highlights_foto/big_highlights_photo'),
		Footer				= require('./footer');

const BigEventHighlight = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const	binding	= this.getDefaultBinding().sub('events');

		const	isSync	= binding.get('highlightEvent.isSync') && binding.get('footerEvents.isSync');

		if(isSync) {
			const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
					photos			= binding.toJS('highlightEvent.photos'),
					footerEvents	= binding.toJS('footerEvents.events');

			return (
				<div className="bEventHighlight">
					<BigHighlightsPhoto photos={photos}/>
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

module.exports = BigEventHighlight;