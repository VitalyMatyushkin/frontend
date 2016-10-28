const	React				= require('react'),
		Morearty			= require('morearty'),

		BigHighlightsPhoto	= require('./highlights_foto/big_highlights_photo');

const BigEventHighlight = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const	binding			= this.getDefaultBinding().sub('events');

		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				isSync 			= binding.get('highlightEvent.isSync');

		if(isSync) {
			const	event	= binding.toJS('highlightEvent.event'),
					photos	= binding.toJS('highlightEvent.photos');

			return (
				<div className="bEventHighlight">
					<BigHighlightsPhoto photos={photos}/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = BigEventHighlight;