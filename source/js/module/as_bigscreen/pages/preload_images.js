const	React				= require('react'),
		Morearty			= require('morearty'),
		Helpers				= require('module/as_bigscreen/pages/helpers/helpers'),
		EventHighlight		= require('./event_highlight'),
		classNames			= require('classnames'),
		Style				= require('styles/ui/bid_screen_fixtures/bEventHighLightWrapper.scss');

const PreloadImages = React.createClass({
	mixins: [Morearty.Mixin],
	renderImages: function () {
		const binding = this.getDefaultBinding();
		const events = binding.toJS('events.highlightEvents.events');

		let photoArray = [];
		events.forEach(event => {
			photoArray = photoArray.concat(event.photos);
		});

		return photoArray.map(photo => {
			const url = photo.picUrl;
			const style = {
				backgroundImage: `url(${url})`
			};

			return (
				<div
					className	= 'ePreloadImageContainer_image'
					style		= { style }
				>
				</div>
			);
		});
	},
	render: function() {
		return (
			<div className = 'bPreloadImageContainer'>
				{ this.renderImages() }
			</div>
		);
	}
});

module.exports = PreloadImages;