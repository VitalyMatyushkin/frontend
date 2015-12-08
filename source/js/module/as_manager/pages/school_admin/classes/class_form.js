var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	Promise = require('bluebird'),
	ClassForm;

ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	getAllAges: function() {
		var self = this,
			allAgesArray = [];

		for (var i = 3; i <= 8; i++) {
			allAgesArray.push({
				value: 'Y' + i,
				age: i,
				id: i
			});
		}

		return Promise.resolve(allAgesArray);
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" promptOnBlank={true} field="name" validation="required">Form name</FormField>
				<FormField type="select" sourcePromise={self.getAllAges} field="age" validation="required">Age group</FormField>
			</Form>
		)
	}
});


module.exports = ClassForm;
