const	React		= require('react'),
		Morearty	= require('morearty');

const	Form 		= require('module/ui/form/form'),
		FormField	= require('module/ui/form/form_field');

const ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func
	},
	componentWillUnmount: function () {
		this.getDefaultBinding().sub('housesForm').clear();
	},
	render: function() {
		return (
			<div className ="eHouseForm">
				<Form
					formStyleClass	= "mNarrow"
					name			= { this.props.title }
					onSubmit		= { this.props.onFormSubmit }
					binding			= { this.getDefaultBinding().sub('housesForm') }
					submitButtonId	= 'house_submit'
					cancelButtonId	= 'house_cancel'
				>
					<FormField
						type		= "imageFile"
						field		= "pic"
						labelText	= "+"
						typeOfFile	= "image"
					/>
					<FormField
						id			= "house_name"
						type		= "text"
						field		= "name"
						validation	= "required"
					>
						House name
					</FormField>
					<FormField
						id		= "house_description"
						type	= "text"
						field	= "description"
					>
						Description
					</FormField>
					<FormField
						id			= "house_color_select"
						classNames	= "mSingleLine"
						type		= "colors"
						maxColors	= { 2 }
						field		= "colors"
					>
						Colours
					</FormField>
				</Form>
			</div>
		)
	}
});


module.exports = ClassForm;
