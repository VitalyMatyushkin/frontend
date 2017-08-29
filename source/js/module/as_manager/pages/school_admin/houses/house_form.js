const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		React 		= require('react'),
		Morearty	= require('morearty');

const ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return ( <div className ="eHouseForm">
			<Form
				formStyleClass="mNarrow"
				name={self.props.title}
				onSubmit={self.props.onFormSubmit}
				binding={self.getDefaultBinding()}
				submitButtonId	= 'house_submit'
				cancelButtonId	= 'house_cancel'
			>
				<FormField
					type 		= "imageFile"
					field 		= "pic"
					labelText 	= "+"
					typeOfFile 	= "image"
				/>
				<FormField type="text" id="house_name" field="name" validation="required" >House name</FormField>
				<FormField type="text" id="house_description" field="description">Description</FormField>
				<FormField classNames="mSingleLine" id="house_color_select" type="colors" maxColors={2} field="colors">Colours</FormField>
			</Form></div>
		)
	}
});


module.exports = ClassForm;
