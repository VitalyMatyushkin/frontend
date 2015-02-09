var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	AddSchoolForm;

AddSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	onSuccess: function(data) {
		var self = this;

		// Добавление школы в списк
		self.getDefaultBinding().update('list', function(ImmutableValue){
			ImmutableValue = ImmutableValue || Immutable.List();
			return ImmutableValue.push(data);
		});

		// Переход к списку школ
		document.location.hash = 'schools';
	},
	render: function() {
		var self = this;

		return (
			<Form name="Add new school" service="schools" binding={self.getDefaultBinding().sub('form')} onSuccess={self.onSuccess}>
				<FormField type="area" field="zipCodeId" validation="required">Zip code</FormField>
				<FormField type="text" field="name" validation="required">Name</FormField>
			</Form>
		)
	}
});


module.exports = AddSchoolForm;
