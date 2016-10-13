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
				<div className='eAddPhotoButton_body'>
					<div className="eAddPhotoButton_plus">+</div>
				</div>
				<div className='eAddPhotoButton_footer'>Add photo...</div>
			</div>
		);
	}
});

module.exports = AddPhotoButton;