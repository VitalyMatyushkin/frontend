var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
 	PromiseClass = require('module/core/promise'),
	NewsForm;

NewsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" field="title" validation="required">Title</FormField>
				<FormField type="textarea" field="body" validation="required">Text</FormField>
				<FormField type="date" field="date" validation="required">Date</FormField>
                <input type="file" />
			</Form>
		)
	}
});


module.exports = NewsForm;
