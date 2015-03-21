var ClassForm = require('module/pages/school_admin/classes/class_form'),
	ClassEditPage;

ClassEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			formId = routingData.id;

		binding.clear();

		if (formId) {
			window.Server.form.get(formId).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.formId = formId;
		}
	},
	submitEdit: function(data) {
		var self = this;

		window.Server.form.put(self.formId, data).then(function() {
			self.isMounted() && (document.location.hash = 'school_admin/classes');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<ClassForm title="Edit form" onFormSubmit={self.submitEdit} binding={binding} />
		)
	}
});


module.exports = ClassEditPage;
