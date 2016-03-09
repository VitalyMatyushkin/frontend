const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
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
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" field="title" validation="required">Title</FormField>
				<FormField type="textarea" field="body" validation="required">Text</FormField>
				<FormField type="date" field="date" validation="required">Date</FormField>
				<FormColumn type="column">
					<FormField type="imageFile" labelText="Add image to news" typeOfFile="image" field="picUrl"/>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = NewsForm;
