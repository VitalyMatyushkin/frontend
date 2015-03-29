var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
 	PromiseClass = require('module/core/promise'),
	ClassForm;

ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	getAllAges: function() {
		var self = this,
			allAgesArray = [],
			promise = new PromiseClass();

		for (var i = 3; i <= 8; i++) {
			allAgesArray.push({
				value: 'Y' + i,
				age: i,
				id: i
			});
		}

		promise.resolve(allAgesArray);

		// Service Promise capability TODO: wtf
		promise.abort = function(){};

		return promise;
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" field="name" validation="required">Form name</FormField>
				<FormField type="select" sourcePromise={self.getAllAges} field="age" validation="required">Age group</FormField>
			</Form>
		)
	}
});


module.exports = ClassForm;
