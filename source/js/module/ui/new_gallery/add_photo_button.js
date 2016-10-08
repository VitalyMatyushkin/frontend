const React = require('react');

const AddPhotoButton = React.createClass({
	propTypes: {
		handleClick:	React.PropTypes.func.isRequired
	},
	render: function() {
		return (
			<div	className	= 'bAddPhotoButton'
					onClick		= { this.props.handleClick }
			>
				<span className='eAlbumTitle'>Add photo...</span>
			</div>
		);
	}
});

module.exports = AddPhotoButton;