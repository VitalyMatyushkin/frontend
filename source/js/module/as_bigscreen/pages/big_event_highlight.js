const	React			= require('react'),
		Morearty		= require('morearty'),
		DefaultHeader	= require('./default_header'),
		HighlightsPhoto	= require('./highlights_foto/highlights_photo'),
		Footer			= require('./footer'),
		Helpers			= require('module/as_bigscreen/pages/helpers/helpers'),
		classNames		= require('classnames'),
		Style			= require('styles/ui/bid_screen_fixtures/bEventHighlight.scss');

const BigEventHighlight = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isShow: React.PropTypes.bool.isRequired
	},
	getClassName: function () {
		return classNames({
			bEventHighlight:	true,
			mDisable:			!this.props.isShow
		});
	},
	getCurrentFooterEvent: function() {
		const binding = this.getDefaultBinding().sub('events.footerEvents');

		const	currentEventIndex	= binding.toJS('currentEventIndex'),
				events				= binding.toJS('events');

		return events[currentEventIndex];
	},
	getPhotos: function () {
		const currentEvent = Helpers.getCurrentHighLightEvent(
			this.getDefaultBinding()
		);
		const currentEventPhotos = currentEvent.photos;

		const resultPhotoArray = [
			[],
			[]
		];
		let currentIndex = 0;
		currentEventPhotos.forEach(p => {
			resultPhotoArray[currentIndex].push(p);
			currentIndex = currentIndex === 0 ? 1 : 0;
		});

		return resultPhotoArray;
	},
	render: function() {
		const	binding	= this.getDefaultBinding().sub('events');

		const	isSync	= binding.get('lastFiveEvents.isSync') && binding.get('footerEvents.isSync');

		if(isSync) {
			const activeSchoolId = this.getMoreartyContext().getBinding().get('activeSchoolId');
			const currentEvent = Helpers.getCurrentHighLightEvent(
				this.getDefaultBinding()
			);
			const photos = this.getPhotos();
			const footerEvent = this.getCurrentFooterEvent();

			return (
				<div className = { this.getClassName() }>
					<div className='bBigHighlightsPhoto'>
						<div className="eBigHighlightsPhoto_titleContainer">
							<DefaultHeader
								title	= "EVENT HIGHLIGHT"
								logo	= "images/big-logo-green.svg"
							/>
						</div>
						<HighlightsPhoto
							eventId	= { currentEvent.id }
							photos	= { photos[0] }
						/>
						<HighlightsPhoto
							eventId	= { currentEvent.id }
							photos	= { photos[1] }
						/>
					</div>
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