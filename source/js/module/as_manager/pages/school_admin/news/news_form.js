const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		Morearty	= require('morearty'),
		React 		= require('react');

const NewsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	render: function() {
		const self = this;

		return (
				<div>
			<Form onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" field="title" validation="required">Title</FormField>
				<FormField type="date" field="date" validation="required">Date</FormField>
				<FormField type="textarea" field="body" validation="required">Text</FormField>
				<FormColumn>
					<FormField type="imageFile" labelText="+" typeOfFile="image" field="picUrl"/>
				</FormColumn>
			</Form>
					</div>
		)
	}
});


module.exports = NewsForm;
