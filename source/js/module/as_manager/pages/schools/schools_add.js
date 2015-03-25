var SchoolForm = require('module/as_manager/pages/schools/schools_form'),
	AddSchoolForm;

AddSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	submitAdd: function(schoolData) {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		// Добавление школы в списк
		binding.update(function(ImmutableValue){
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
		)
	}
});


module.exports = AddSchoolForm;
