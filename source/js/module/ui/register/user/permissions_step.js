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
			houseId: null
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
				name: 'official',
				icon: 'user-tie'
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
		var self = this,
			binding = self.getDefaultBinding();

		return window.Server.schools.get({
			filter: {
				where: {
					name: {
						like: schoolName,
						options: 'i'
					}
				},
				limit: 10
			}
		});
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
					schoolId: binding.get('schoolId'),
					name: {
						like: houseName,
						options: 'i'
					}
				},
				limit: 10
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
					schoolId: binding.get('schoolId'),
					name: {
						like: formName,
						options: 'i'
					}
				},
				limit: 10
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
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentType = binding.get('type');

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
						<Morearty.DOM.input
							type="text"
							className="eRegistration_input"
							placeholder="Firstname"
							ref="firstNameField"
							onChange={ Morearty.Callback.set(binding, 'firstName') }
							/>
						<Morearty.DOM.input
							type="text"
							className="eRegistration_input"
							placeholder="Lastname"
							ref="lastNameField"
							onChange={ Morearty.Callback.set(binding, 'lastName') }
							/>
					</div>
				</If>
			</div>
		</div>
	}
});


module.exports = PermissionsStep;
