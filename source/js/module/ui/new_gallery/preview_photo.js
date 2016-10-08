const React = require('react');

const PreviewPhoto = React.createClass({
	propTypes: {
		id:					React.PropTypes.string.isRequired,
		url:				React.PropTypes.string.isRequired,
		handleClickPhoto:	React.PropTypes.func.isRequired
	},

	handleClickPhoto: function() {
		this.props.handleClickPhoto(this.props.id)
	},

	render: function() {
		const background  = {
			backgroundImage: `url(${this.props.url})`
		};

		return (
			<div	className	= 'bPreviewPhoto'
					onClick		= { this.handleClickPhoto }
					style		= { background }
			>
			</div>
		);
	}
});

module.exports = PreviewPhoto;
