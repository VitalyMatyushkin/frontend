var CoachForm = require('module/shared_pages/settings/permissions/forms/coach'),
	OfficialForm = require('module/shared_pages/settings/permissions/forms/official'),
	ParentForm = require('module/shared_pages/settings/permissions/forms/parent'),
	ChooseType = require('module/shared_pages/settings/permissions/forms/type'),
	PermissionsForm;

PermissionsForm = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			permissionType: 'select'
		});
	},
	submitForm: function() {
		var self = this;

		debugger
	},
	render: function() {
		var self = this,
			currentView,
			binding = self.getDefaultBinding(),
			permissionType = binding.get('permissionType');

		switch(permissionType) {
			case 'select':
				currentView = <ChooseType binding={binding} />;
				break;
			case 'parent':
				currentView = <ParentForm onFormSubmit={self.submitForm} binding={binding.sub('formFields')} />;
				break;
			case 'coach':
				currentView = <CoachForm onFormSubmit={self.submitForm} binding={binding.sub('formFields')} />;
				break;
			case 'official':
				currentView = <OfficialForm onFormSubmit={self.submitForm} binding={binding.sub('formFields')} />;
				break;
			default:
				currentView = <ChooseType binding={binding} />;
				break;
		}

		console.log(permissionType)

		return (
			<div>
				{currentView}
			</div>
		)
	}
});


module.exports = PermissionsForm;

