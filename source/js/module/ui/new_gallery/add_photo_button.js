const	React	= require('react'),

		Loader	= require('./../../ui/loader');

const AddPhotoButton = React.createClass({
	fileInputRef: undefined,

	propTypes: {
		isLoading:		React.PropTypes.bool.isRequired,
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
		const isLoading = this.props.isLoading,
			btnText = isLoading ? 'Uploading...' : 'Add photo',
			btnComponent = isLoading ? null : <input	className	= 'eAddPhotoButton_fileInput'
															type		= 'file'
															onChange	= { this.handleChange }
															ref			= { ref => this.fileInputRef = ref }
													/>;

		return (
			<div className = 'bAddPhotoButton' onClick = { this.handleClick } >
				{btnText}
				{btnComponent}
			</div>
		);
	}
});

module.exports = AddPhotoButton;