var ClassForm = require('module/pages/school/classes/class_form'),
	ClassEditPage;

ClassEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			classId = routingData.id;

		binding.clear();

		if (activeSchoolId && classId) {
			window.Server.class.get({
				schoolId: activeSchoolId,
				classId: classId
			}).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.activeSchoolId = activeSchoolId;
			self.classId = classId;
		}
	},
	submitEdit: function(data) {
		var self = this;

		window.Server.class.put({
			classId: self.classId,
			schoolId: self.activeSchoolId
		}, data).then(function() {
			self.isMounted() && (document.location.hash = 'school/classes');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<ClassForm title="Edit class" onFormSubmit={self.submitEdit} schoolId={self.activeSchoolId} binding={binding} />
		)
	}
});


module.exports = ClassEditPage;
