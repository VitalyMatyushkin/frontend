/**
 * Created by vitaly on 12.09.17.
 */
const 	React 			= require('react'),
		Lazy 			= require('lazy.js'),
		Morearty 		= require('morearty'),
		Form 			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field');

const PostcodeForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: 			React.PropTypes.string.isRequired,
		onFormSubmit: 	React.PropTypes.func
	},
	render: function() {
		const 	binding = this.getDefaultBinding();
		return (
			<Form
				formStyleClass 	= "mNarrow"
				name 			= { this.props.title }
				onSubmit 		= { this.props.onFormSubmit }
				binding 		= { binding.sub('postcodeData') }
				submitButtonId	= 'postcode_submit'
				cancelButtonId	= 'postcode_cancel'
			>
				<FormField
					type 		= "text"
					field 		= "postcode"
					id 			= "postcode_name"
					validation 	= "required postcode"
				>
					Postcode name
				</FormField>
				<FormField
					type 		= "number"
					field 		= "point.lng"
					id 			= "postcode_lng"
					validation 	= "required longitude"
				>
					Longitude
				</FormField>
				<FormField
					type 		= "number"
					field 		= "point.lat"
					id 			= "postcode_lat"
					validation 	= "required latitude"
				>
					Latitude
				</FormField>
			</Form>
		)
	}
});


module.exports = PostcodeForm;
