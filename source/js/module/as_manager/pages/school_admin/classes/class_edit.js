var ClassForm = require('module/as_manager/pages/school_admin/classes/class_form'),
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
		//Don't submit if the name field of the data is empty
		//Server will respond with failure causing button to stop at loading
		if(data.name !=''){
			data.name = data.name.toUpperCase(); //cast form name to upper case for consistency
			window.Server.form.put(self.formId, data).then(function() {
				self.isMounted() && (document.location.hash = 'school_admin/forms');
			});
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
				<div style={{position:'relative', border:1+'px solid #000000'}}>
					<ClassForm title="Edit form" onFormSubmit={self.submitEdit} binding={binding} />
				</div>
		)
	}
});


module.exports = ClassEditPage;
