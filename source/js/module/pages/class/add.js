var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	AddNewClass;

AddNewClass = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: React.PropTypes.string.isRequired,
		classId: React.PropTypes.string,
		mode: React.PropTypes.string
	},
	onSuccess: function(data) {
		var self = this;

		// Переход к списку школ
		document.location.hash = 'school?id=' + self.props.schoolId;
	},
	submitForm: function(data) {
		var self = this;

		if (self.props.mode === 'edit' && self.props.classId) {
			window.Server.class.put({
				classId: self.props.classId,
				schoolId: self.props.schoolId
			}, data).then(self.onSuccess.bind(self));
		} else {
			data.schoolId = self.props.schoolId;
			window.Server.classes.post(self.props.schoolId, data).then(self.onSuccess.bind(self));
		}
	},
	render: function() {
		var self = this,
			formTitle = self.props.mode === 'edit' ? 'Edit class' : 'Add new class';

		return (
			<Form name={formTitle} onSubmit={self.submitForm} binding={self.getDefaultBinding()} >
				<FormField type="text" field="name" validation="required">Class name</FormField>
				<FormField type="text" field="age" validation="">Age</FormField>
			</Form>
		)
	}
});


module.exports = AddNewClass;
