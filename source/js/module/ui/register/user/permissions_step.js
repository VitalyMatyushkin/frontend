var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	PermissionsList = require('module/as_manager/pages/school_admin/permissions/permissions_list'),
	SVG = require('module/ui/svg'),
	If = require('module/ui/if/if'),
	Autocomplete = require('module/ui/autocomplete/autocomplete'),
	PermissionsStep;

PermissionsStep = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'PermissionsList',
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	getDefaultState: function() {
		return Immutable.fromJS({
			type: null,
			schoolId: null,
			formId: null,
			houseId: null,
			firstName: null,
			lastName: null
		});
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		self.types = [
			{
				name: 'parent',
				icon: 'users'
			},
			{
				name: 'admin',
				icon: 'user-tie'
			},
			{
				name: 'manager',
				icon: 'user-tie'
			},
			{
				name: 'teacher',
				icon: 'user'
			},
			{
				name: 'coach',
				icon: 'user'
			}
		];

		binding.sub('schoolId').addListener(function(descriptor) {

			if (descriptor.isValueChanged()) {
				binding.sub('_houseAutocomplete').clear();
				binding.sub('_formAutocomplete').clear();
				binding
					.atomically()
					.set('formId', null)
					.set('houseId', null)
					.commit();
			}
		});
	},
	_onClickType: function(type) {
		var self = this,
			binding = self.getDefaultBinding();

		binding
			.atomically()
			.set('type', type)
			.commit();
	},
	/**
	 * school filter by schoolName
	 * @param schoolName
	 * @returns {*}
	 */
	serviceSchoolFilter: function(schoolName) {
		var self = this;

		return window.Server.getAllSchools.get();
	},
	/**
	 * house filter by houseName
	 * @param houseName
	 * @returns {*}
	 */
	serviceHouseFilter: function(houseName) {
		var self = this,
			binding = self.getDefaultBinding();

		return window.Server.houses.get(binding.get('schoolId'), {
			filter: {
				where: {
					schoolId: binding.get('schoolId')
				}
			}
		});
	},
	/**
	 * form filter by formName
	 * @param formName
	 * @returns {*}
	 */
	serviceFormFilter: function(formName) {
		var self = this,
			binding = self.getDefaultBinding();

		return window.Server.forms.get(binding.get('schoolId'), {
			filter: {
				where: {
					schoolId: binding.get('schoolId')
				}
			}
		});
	},
	onSelectSchool: function(schoolId) {
		var self = this,
			binding = self.getDefaultBinding();

		binding
			.atomically()
			.set('schoolId', schoolId)
			.commit();
	},
	onSelectHouse: function(houseId) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('houseId', houseId);
	},
	onSelectForm: function(formId) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('formId', formId);
	},
	onChangeFirstName: function(event) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('firstName', event.currentTarget.value);
	},
	onChangeLastName: function(event) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('lastName', event.currentTarget.value);
	},
	renderChooser: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return <div className="eRegistration_chooser">
			{self.types.map(function(type) {
				var itemClasses = classNames({
					eRegistration_chooserItem: true,
					mActive: binding.get('type') === type.name
				});

				return <div className={itemClasses} onClick={self._onClickType.bind(null, type.name)}>
					<SVG icon={'icon_' + type.icon} />
					<span className="eRegistration_chooserTitle">{type.name.toUpperCase()}</span>
				</div>;
			})}
		</div>
	},
	onSuccess: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentType = binding.get('type'),
			dataToPost;

		if(currentType === 'parent') {
			dataToPost = {
				userId: binding.get('account').toJS().userId
			};

			window.Server.parentRequests
				.post(dataToPost)
				.then(function(parentRequest) {
					window.Server.childRequests
						.post(
							parentRequest.id,
							{
								"schoolId": binding.get('schoolId'),
								"formId": binding.get('formId'),
								"houseId": binding.get('houseId'),
								"firtsName": binding.get('firstName'),
								"lastName": binding.get('lastName')
							}
						)
						.then(function() {
							self.props.onSuccess();
						});
				});
		} else {
			dataToPost = {
				preset: binding.get('type'),
				schoolId: binding.get('schoolId')
			};

			window.Server.Permissions
				.post(dataToPost)
				.then(function() {
					self.props.onSuccess();
				});
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentType = binding.get('type'),
			isShowFinishButton = false;

		var isFormFilled = function(currentType) {

			return	(
						(
							currentType === 'admin' || currentType === 'manager' ||
							currentType === 'teacher' || currentType === 'coach'
						) && binding.get('schoolId') !== null
					) ||
					(
							currentType === 'parent' &&
							binding.get('schoolId') !== null && binding.get('houseId') !== null &&
							binding.get('formId') !== null && binding.get('firstName') !== null &&
							binding.get('lastName') !== null
					);
		};

		if(isFormFilled(currentType)) {
			isShowFinishButton = true;
		}

		return <div className="eRegistration_permissions">
			<div className="eRegistration_annotation">Join as:</div>
			{self.renderChooser()}
			<div className="eRegistration_permissionsField">
				<If condition={currentType !== null}>
					<Autocomplete
						serviceFilter={self.serviceSchoolFilter}
						serverField="name"
						onSelect={self.onSelectSchool}
						binding={binding.sub('_schoolAutocomplete')}
						placeholderText="school's name"
						/>
				</If>

				<If condition={binding.get('schoolId') !== null && currentType === 'parent'}>
					<Autocomplete
						serviceFilter={self.serviceHouseFilter}
						serverField="name"
						onSelect={self.onSelectHouse}
						binding={binding.sub('_houseAutocomplete')}
						placeholderText="house's name"
						/>
				</If>
				<If condition={binding.get('houseId') !== null && currentType === 'parent'}>
					<Autocomplete
						serviceFilter={self.serviceFormFilter}
						serverField="name"
						onSelect={self.onSelectForm}
						placeholderText="form's name"
						binding={binding.sub('_formAutocomplete')}
						/>
				</If>
				<If condition={binding.get('formId') !== null && currentType === 'parent'}>
					<div>
						<div className="eRegistration_input">
							<input ref="firstNameField" placeholder="Firstname" type={'text'} onChange={self.onChangeFirstName} />
						</div>
						<div className="eRegistration_input">
							<input ref="lastNameField" placeholder="Lastname" type={'text'} onChange={self.onChangeLastName} />
						</div>
					</div>
				</If>
				<If condition={isShowFinishButton}>
					<div className="bButton bButton_reg" onClick={self.onSuccess}>Continue</div>
				</If>
			</div>
		</div>
	}
});

module.exports = PermissionsStep;
