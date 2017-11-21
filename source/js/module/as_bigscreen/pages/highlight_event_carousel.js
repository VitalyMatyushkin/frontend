const	React				= require('react'),
		Morearty			= require('morearty'),
		Helpers				= require('module/as_bigscreen/pages/helpers/helpers'),
		EventHighlight		= require('./event_highlight'),
		classNames			= require('classnames'),
		Style				= require('styles/ui/bid_screen_fixtures/bEventHighLightWrapper.scss');

const HighlightEventCarousel = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isShow: React.PropTypes.bool.isRequired
	},
	getClassName: function () {
		return classNames({
			bEventHighLightWrapper:	true,
			mDisable:				!this.props.isShow
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		let content = null;
		if(binding.get('events.highlightEvents.isSync')) {
			const currentEvent = Helpers.getCurrentHighLightEvent(
				binding
			);

			if(typeof currentEvent !== 'undefined') {
				content = (
					<div
						className = { this.getClassName() }
					>
						<EventHighlight
							binding		= { binding }
							eventData	= { currentEvent }
						/>
					</div>
				);
			}
		}

		return content;
	}
});

module.exports = HighlightEventCarousel;