var CoachesForm = require('module/as_manager/pages/school_admin/coaches/coaches_form'),
	CoachesAddPage;

CoachesAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;

		data.password =

		self.activeSchoolId && window.Server.schoolCoaches.post(self.activeSchoolId, data).then(function() {
			document.location.hash = 'school_admin/coaches';
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<CoachesForm title="Add coach..." onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = CoachesAddPage;
