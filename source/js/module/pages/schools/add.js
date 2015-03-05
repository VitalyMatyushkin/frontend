var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	AddSchoolForm;

AddSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	onSuccess: function(schoolData) {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		// Добавление школы в списк
		binding.update('list', function(ImmutableValue){
			ImmutableValue = ImmutableValue || Immutable.List();
			return ImmutableValue.push(schoolData);
		});

		// Добавляемая школа всегда становится школой "по умолчанию"
		globalBinding.set('userRules.activeSchoolId', schoolData.id);

		// Переход к списку школ
		document.location.hash = 'schools';
	},
	render: function() {
		var self = this;

		return (
			<Form name="Add new school" service="schools" binding={self.getDefaultBinding().sub('form')} onSuccess={self.onSuccess}>
				<FormField type="area" field="zipCodeId" validation="required">Postcode</FormField>
				<FormField type="text" field="name" validation="required">Name</FormField>
			</Form>
		)
	}
});


module.exports = AddSchoolForm;
