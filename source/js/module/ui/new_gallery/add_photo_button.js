const React = require('react');

const AddPhotoButton = React.createClass({
	fileInputRef: undefined,

	propTypes: {
		handleChange:	React.PropTypes.func.isRequired
	},

	handleClick: function() {
		if(typeof this.fileInputRef !== 'undefined') {
			const event = new MouseEvent('click');
			this.fileInputRef.dispatchEvent(event);
		}
	},
	handleChange: function(eventDescriptor) {
		this.props.handleChange(eventDescriptor.target.files[0]);
	},
	render: function() {
		return (
			<div	className	= 'bAddPhotoButton'
					onClick		= { this.handleClick }
			>
				<div className='eAddPhotoButton_body'>
					<div className="eAddPhotoButton_plus">+</div>
				</div>
				<div className='eAddPhotoButton_footer'>Add photo...</div>
				<input	className	= 'eAddPhotoButton_fileInput'
						type		= 'file'
						onChange	= { this.handleChange }
						ref			= { ref => this.fileInputRef = ref }
				/>
			</div>
		);
	}
});

module.exports = AddPhotoButton;