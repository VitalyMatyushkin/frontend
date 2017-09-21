const	React 		= require('react'),
		Morearty	= require('morearty');

const	Form		= require('module/ui/form/form'),
		FormField	= require('module/ui/form/form_field');

const ClubsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func.isRequired
	},
	render: function() {
		const self = this;

		return (
			<div className ="eHouseForm">
				<Form
					formStyleClass	= "mNarrow"
					name			= {self.props.title}
					onSubmit		= {self.props.onFormSubmit}
					binding			= {self.getDefaultBinding().sub('form')}
					submitButtonId	= 'club_submit'
					cancelButtonId	= 'club_cancel'
				>
					<FormField
						type="text"
						id="house_name"
						field="name"
						validation="required"
					>
						Club name
					</FormField>
					<FormField
						type="text"
						id="house_description"
						field="description"
					>
						Description
					</FormField>
				</Form>
			</div>
		);
	}
});

module.exports = ClubsForm;
