const	React		= require('react'),
		classNames	= require('classnames');

const	Style		= require('styles/ui/bid_screen_fixtures/bHighlightsPhoto.scss');

const HighlightsPhoto = React.createClass({
	propTypes: {
		style:		React.PropTypes.string.isRequired,
		isSmall:	React.PropTypes.bool.isRequired
	},
	getClassName: function () {
		return classNames({
			eHighlightsPhoto_photo:	true,
			mSmall:					this.props.isSmall
		});
	},
	render: function() {
		return (
			<div
				className	= { this.getClassName() }
				style		= { this.props.style }
			>
			</div>
		);
	}
});

module.exports = HighlightsPhoto;