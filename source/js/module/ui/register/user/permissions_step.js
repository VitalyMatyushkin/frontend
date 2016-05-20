const   RegistrationPermissions 	= require('module/ui/register/user/registration_permissions'),
        classNames                  = require('classnames'),
        React                       = require('react');


let multipleFields;

/** component which show list of roles to join with and some info on requested role details*/
const PermissionsStep = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'PermissionsList',
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	componentWillMount: function () {
		const self = this,
			binding = self.getDefaultBinding();

		self.types = [
			{name: 'parent'},
			{name: 'admin'},
			{name: 'manager'},
			{name: 'teacher'},
			{name: 'coach'}
		];

		binding.sub('schoolId').addListener(descriptor => {

			if (descriptor.isValueChanged()) {
				binding.sub('_houseAutocomplete').clear();
				binding.sub('_formAutocomplete').clear();
				binding.sub('formId').clear();
				binding.sub('formName').clear();
				binding.sub('houseId').clear();
				binding.sub('houseName').clear();
			}
		});
		multipleFields = 1;
	},
	_onClickType: function (type) {
		var self = this,
			binding = self.getDefaultBinding();

		binding
			.atomically()
			.set('type', type)
			.commit();
	},
	fieldsMultiplier: function () {
		var self = this;
		if (multipleFields <= 2) {
			multipleFields += 1;
		}
		self.forceUpdate();
	},

	/** will render list with all available roles to join */
	renderChooser: function () {
		const self = this,
			binding = self.getDefaultBinding();

		return <div className="eRegistration_chooser">
			{self.types.map(function (type) {
				var itemClasses = classNames({
					eRegistration_chooserItem: true,
					mActive: binding.get('type') === type.name
				});

				return <div className={itemClasses} onClick={self._onClickType.bind(null, type.name)}>
					<div className="eChooserItem_wrap">
						<div className="eChooserItem_inside"></div>
					</div>
					<span className="eRegistration_chooserTitle">{type.name}</span>
				</div>;
			})}
		</div>
	},
	isFormFilled: function (currentType) {
		const self = this,
			binding = self.getDefaultBinding();
		return (
				(
					currentType === 'admin' || currentType === 'manager' ||
					currentType === 'teacher' || currentType === 'coach'
				) && binding.get('fields.0.schoolId')
			) ||
			(
				currentType === 'parent' &&
				binding.get('fields.0.schoolId') && binding.get('fields.0.houseId') &&
				binding.get('fields.0.formId') && binding.get('fields.0.firstName') &&
				binding.get('fields.0.lastName')
			);
	},
	render: function () {
		const self = this,
			binding = self.getDefaultBinding(),
			currentType = binding.get('type');

		let isShowFinishButton = false;

		if (self.isFormFilled(currentType)) {
			isShowFinishButton = true;
		}

		return <div className="eRegistration_permissions">
			<div className="eRegistration_annotation">Join as:</div>
			{self.renderChooser()}
			<div className="eRegistration_permissionStep">
				<RegistrationPermissions binding={binding} isFormFilled={isShowFinishButton}
											 onSuccess={self.props.onSuccess} showButtons={true}
											 fieldCounter={multipleFields} onAnother={self.fieldsMultiplier}/>
			</div>
		</div>
	}
});

module.exports = PermissionsStep;
