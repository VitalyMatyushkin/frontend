const	React	= require('react'),

		Loader	= require('./../../ui/loader');

const AddPhotoButton = React.createClass({
	fileInputRef: undefined,

	propTypes: {
		isLoading:				React.PropTypes.bool.isRequired,
		isUserCanUploadPhotos:	React.PropTypes.bool.isRequired,
		handleChange:			React.PropTypes.func.isRequired
	},

	handleClick: function() {
		if(this.props.isUserCanUploadPhotos) {
			if(typeof this.fileInputRef !== 'undefined') {
				let event;
				//This is true only for IE,firefox
				//Dirty hack from https://codeproject.com/Tips/893254/JavaScript-Triggering-Event-Manually-in-Internet-E
				//However, MDN recommend use very similar polyfill https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent#Polyfill
				if(document.createEvent){
					// To create a mouse event , first we need to create an event and then initialize it.
					event = document.createEvent("MouseEvent");
					event.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
				} else {
					event = new MouseEvent('click');
				}
				this.fileInputRef.dispatchEvent(event);
			}
		} else {
			window.simpleAlert(
				`Sorry, this feature is not available in your school`,
				'Ok',
				() => {}
			);
		}
	},
	handleChange: function(eventDescriptor) {
		this.props.handleChange(eventDescriptor.target.files[0]);
	},
	renderFileInput: function() {
		if(this.props.isLoading) {
			return null;
		} else {
			return (
				<input	className	= 'eAddPhotoButton_fileInput'
						type		= 'file'
						onChange	= { this.handleChange }
						ref			= { ref => this.fileInputRef = ref }
				/>
			);
		}
	},
	render: function() {


		return (
			<div	className	= 'bAddPhotoButton'
					onClick		= { this.handleClick }
			>
				{'Add photo'}
				{this.renderFileInput()}
			</div>
		);
	}
});

module.exports = AddPhotoButton;