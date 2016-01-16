const 	CoachForm 		= require('module/shared_pages/settings/permissions/forms/coach'),
		OfficialForm 	= require('module/shared_pages/settings/permissions/forms/official'),
		ParentForm 		= require('module/shared_pages/settings/permissions/forms/parent'),
		ChooseType 		= require('module/shared_pages/settings/permissions/forms/type'),
		React 			= require('react'),
		ReactDOM 		= require('reactDom'),
		Immutable 		= require('immutable');


const PermissionsForm = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			permissionType: 'select'
		});
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			registerType = globalBinding.get('userData.authorizationInfo.registerType');

		if (registerType) {
			binding.set('permissionType', registerType);
		}
	},
	resetFormType: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			preset = binding.toJS('permissionType'),
			globalBinding = self.getMoreartyContext().getBinding();

		binding.set('permissionType', 'select');
		globalBinding.clear('userData.authorizationInfo.registerType');
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
			self.resetFormType();
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
				currentView = <ParentForm goBackClick={self.resetFormType} onFormSubmit={self.submitForm} binding={binding.sub('formFields')} />;
				break;
			case 'coach':
				currentView = <CoachForm goBackClick={self.resetFormType}  onFormSubmit={self.submitForm} binding={binding.sub('formFields')} />;
				break;
			case 'official':
				currentView = <OfficialForm goBackClick={self.resetFormType}  onFormSubmit={self.submitForm} binding={binding.sub('formFields')} />;
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

