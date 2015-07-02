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
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('permissionType', 'select');
	},
	submitForm: function(data) {
		var self = this,
			binding = self.getDefaultBinding(),
			preset = binding.toJS('permissionType');

		binding.set('permissionType', 'done');

		window.Server.Permissions.post({
			schoolId: data.schoolId,
			principalId: data.ownerId,
			comment: data.comment || '',
			preset: preset
		}).then(function() {
			document.location = '/#settings/permissions';
			binding.set('permissionType', 'select');
			// go to list
			// reset
		});



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
			case 'done':
				currentView = <div className="bForm"><div className="eForm_atCenter">Loading...</div></div>;
				break;
			default:
				currentView = <ChooseType binding={binding} />;
				break;
		}

		return (
			<div>
				{currentView}
			</div>
		)
	}
});


module.exports = PermissionsForm;

