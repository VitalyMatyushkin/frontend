var ClassForm = require('module/as_admin/pages/admin_schools/classes/class_form'),
	React = require('react'),
	ClassAddPage;

ClassAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;
		window.Server.forms.post(data.schoolId, data).then(function() {
			document.location.hash = 'admin_schools/admin_views/forms';
		}).catch(function(err){
			alert(err.errorThrown+' Server Error');
			document.location.hash = 'admin_schools/admin_views/forms';
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<ClassForm title="Add new form..." onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = ClassAddPage;
