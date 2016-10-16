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
		const isLoading = this.props.isLoading;

		if(isLoading) {
			return (
				<div	className	= 'bAddPhotoButton'
						onClick		= { this.handleClick }
				>
					<div className='eAddPhotoButton_body'>
						<Loader condition={true}/>
					</div>
				</div>
			);
		} else {
			return (
				<div	className	= 'bAddPhotoButton'
						onClick		= { this.handleClick }
				>
					<div className='eAddPhotoButton_body'>
						<div className="eAddPhotoButton_plus">+</div>
					</div>
					<div className='eAddPhotoButton_footer'>
						Add photo...
					</div>
					<input	className	= 'eAddPhotoButton_fileInput'
							type		= 'file'
							onChange	= { this.handleChange }
							ref			= { ref => this.fileInputRef = ref }
					/>
				</div>
			);
		}
	}
});

module.exports = AddPhotoButton;