const 	ClassForm 	= require('module/as_manager/pages/school_admin/classes/class_form'),
		React 		= require('react'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable');

const ClassEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
			formId = routingData.id;

		binding.clear();

		if (formId) {
			window.Server.schoolForm.get({schoolId:activeSchoolId, formId:formId}).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.formId = formId;
		}
	},
	submitEdit: function(data) {
        var self = this,
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		//Don't submit if the name field of the data is empty
		//Server will respond with failure causing button to stop at loading
		if(data.name !=''){
			data.name = data.name;
			window.Server.schoolForm.put({schoolId:activeSchoolId, formId:self.formId}, data).then(function() {
				self.isMounted() && (document.location.hash = 'school_admin/forms');
			});
		}
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
