/**
 * Created by wert on 18.11.16.
 */

const 	Form 				= require('module/ui/form/form'),
		FormField 			= require('module/ui/form/form_field'),
		FormColumn 			= require('module/ui/form/form_column'),
		{Map}				= require('module/ui/map/map2_editable'),
		{RolesHelper} 		= require('./roles_helper'),
		SchoolConsts 		= require('../../../helpers/consts/schools'),
		Immutable 			= require('immutable'),
		Morearty 			= require('morearty'),
		propz 				= require('propz'),
		MultiselectDropdown = require('module/ui/multiselect-dropdown/multiselect_dropdown'),
		React 				= require('react');

const SystemAdminSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: 		React.PropTypes.string.isRequired,
		onSubmit: 	React.PropTypes.func
	},
	DEFAULT_SCHOOL_POINT: { coordinates: [-0.246722, 50.832949]},
	//share form and multiselect binding, because multiselect don't include in form
	//and change multiselect call re-render form
	componentWillMount: function () {
		const 	binding 			= this.getDefaultBinding(),
				formBinding 		= binding.sub('form'),
				multiSelectBinding 	= binding.sub('multiSelect'),
				serverRoles 		= formBinding.toJS('allowedPermissionPresets');

		// if it need
		this.setDefaultPublicSiteAccess();
		
		//fill field postcode
		const postcode = formBinding.toJS('postcode');
		if (typeof postcode !== 'undefined') {
			binding.set('selectedPostcode', Immutable.fromJS(postcode));
		}
		binding.set('isSyncForm', true);
		
		multiSelectBinding.set('availableRoles', Immutable.fromJS(RolesHelper.convertRolesFromServerToClient(serverRoles)));
		let roles = multiSelectBinding.toJS('availableRoles');
		if(typeof roles === 'undefined') {
			multiSelectBinding.set('availableRoles', Immutable.fromJS([]));
		}
	},
	getPublicSiteAccessTypes: function() {
		const result = [];
		for(let key in SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE){
			if(SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE.hasOwnProperty(key))
				result.push({
					value: key,
					text: SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE[key]
				});
		}
		return result;
	},
	// if undefined then set def value
	setDefaultPublicSiteAccess: function() {
		const 	binding 		= this.getDefaultBinding(),
				formBinding 	= binding.sub('form');

		if(typeof formBinding.toJS('publicSite.status') === 'undefined') {
			formBinding.set(
				'publicSite.status',
				Immutable.fromJS(SchoolConsts.DEFAULT_PUBLIC_ACCESS_SCHOOL_SERVER_VALUE)
			);
		}
	},
	getSelectedRoles: function () {
		const 	binding 			= this.getDefaultBinding(),
				multiSelectBinding 	= binding.sub('multiSelect');
		return multiSelectBinding.toJS('availableRoles');
	},
	getRegions: function() {
		return [
			{value: 'GB', text: 'GB'},
			{value: 'US', text: 'US'}
		];
	},
	handleSelectRole: function (role) {
		const 	binding 			= this.getDefaultBinding(),
				multiSelectBinding 	= binding.sub('multiSelect'),
				roles 				= multiSelectBinding.toJS('availableRoles'),
				roleIndex 			= roles.findIndex(_r => _r.id === role.id);

		if(roleIndex !== -1) {
			roles.splice(roleIndex, 1);
		} else {
			roles.push(role);
		}
		
		multiSelectBinding.set('availableRoles', Immutable.fromJS(roles));
	},
	onSubmit: function (data) {
		const 	binding 			= this.getDefaultBinding(),
				multiSelectBinding 	= binding.sub('multiSelect');
		data.allowedPermissionPresets = RolesHelper.convertRolesFromClientToServer(multiSelectBinding.toJS('availableRoles'));
		
		propz.set(data, ['postcode', 'point'], this.getDefaultBinding().toJS('point'));
		const postcodeId = this.getDefaultBinding().toJS('selectedPostcode.id');
		if (typeof postcodeId !== 'undefined') {
			propz.set(data, ['postcodeId'], postcodeId);
		}
		
		this.props.onSubmit(data);
	},
	//inverting the values to not change the field names on the server
	valueReader: function(value) {
		switch (value) {
			case true:	return false;
			case false:	return true;
		}
	},
	valueWriter: function(value) {
		switch (value) {
			case false: return true;
			case true:	return false;
		}
	},
	getConditionChildField: function() {
		return [
			{value: 'HIDDEN', text: 'hidden'},
			{value: 'OPTIONAL', text: 'optional'},
			{value: 'REQUIRED', text: 'required'}
		];
	},
	getConditionChildFieldForName: function() {
		return [
			{value: 'OPTIONAL', text: 'optional'},
			{value: 'REQUIRED', text: 'required'}
		];
	},
	getPoint: function() {
		const 	binding 		= this.getDefaultBinding(),
				formBinding 	= binding.sub('form'),
				point 			= formBinding.toJS('postcode.point');

		return typeof point !== 'undefined' ? point : this.DEFAULT_VENUE_POINT;
	},
	
	getNewPoint: function(point) {
		this.getDefaultBinding().set('point', Immutable.fromJS(point));
	},
	getSchoolRegion() {
		return this.getDefaultBinding().toJS('school.region');
	},
	postcodeService: function(searchText) {
		return window.Server.postCodes.get(
			{
				filter: {
					where: {
						postcode: {
							like: searchText,
							options: 'i'
						},
						region: this.getSchoolRegion()
					},
					limit: 10
				}
			});
	},
	onSelectPostcode: function(id, postcode) {
		this.getDefaultBinding().set('selectedPostcode', Immutable.fromJS(postcode));
		this.getDefaultBinding().set('point', Immutable.fromJS(postcode.point));
	},
	render: function () {
		const 	binding 				= this.getDefaultBinding(),
				rootBinding 			= this.getMoreartyContext().getBinding(),
				formBinding				= binding.sub('form'),
				statusActive 			= !rootBinding.get('userRules.activeSchoolId'),
				passActive 				= formBinding.meta().toJS('publicSite.status.value') === 'PROTECTED',
				passBigscreenActive 	= formBinding.meta().toJS('publicBigscreenSite.status.value') === 'PROTECTED',
				yesNoOptions 			= [
					{ text: 'Yes',	value: true },
					{ text: 'No',	value: false }
				],
				postcode 				= formBinding.toJS('postcode');
		
		const 	selectedPostcode 	= binding.toJS('selectedPostcode');

		return (
			<Form
				name 			= { this.props.title }
				binding 		= { formBinding }
				service 		= "i/schools/domains"
				onSubmit 		= { this.onSubmit }
				submitOnEnter 	= { false }
			>
				<FormColumn customStyle={'mTwoColumns'}>
					<FormField
						type 		= "imageFile"
						field 		= "pic"
						labelText 	= "+"
						typeOfFile 	= "image"
					/>
					<FormField
						type 			= "text"
						field 			= "email"
						validation 		= "email"
						fieldClassName 	= "mLarge"
					>
						School Official Email
					</FormField>
					<FormField
						type 			= "text"
						field 			= "sportsDepartmentEmail"
						validation 		= "email"
						fieldClassName 	= "mLarge"
					>
						Sports Department Email
					</FormField>
					<FormField
						type 			= "text"
						field 			= "notificationEmail"
						validation 		= "email"
						fieldClassName 	= "mLarge"
					>
						Notification Email
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "studentImportForAdminAllowed"
					>
						Allow student import for Admin
					</FormField>
					<FormField
						classNames 	= "mWideSingleLine"
						type 		= "checkbox"
						field 		= "studentSelfRegistrationEnabled"
					>
						Student registration
					</FormField>
					<FormField
						classNames 	= "mWideSingleLine"
						type 		= "checkbox"
						field 		= "notificationsEnabled"
					>
						Enable push notification
					</FormField>
					<FormField
						valueReader = { this.valueReader }
						valueWriter = { this.valueWriter }
						classNames 	= "mWideSingleLine"
						type 		= "checkbox"
						field 		= "isClubsEnabled"
					>
						Disable clubs
					</FormField>
					<FormField
						valueReader = { this.valueReader }
						valueWriter = { this.valueWriter }
						classNames 	= "mWideSingleLine"
						type 		= "checkbox"
						field 		= "canPublishWebSite"
					>
						Disable publish web site
					</FormField>
					<FormField
						valueReader = { this.valueReader }
						valueWriter = { this.valueWriter }
						classNames 	= "mWideSingleLine"
						type 		= "checkbox"
						field 		= "canAcceptStaffRoles"
					>
						Disable accept staff roles
					</FormField>
					<FormField
						valueReader = { this.valueReader }
						valueWriter = { this.valueWriter }
						classNames 	= "mWideSingleLine"
						type 		= "checkbox"
						field 		= "isFavoriteSportsEnabled"
					>
						Disable favorite sports in limited school version
					</FormField>
					<h3>For parent registration</h3>
					<FormField
						type 		= "dropdown"
						field 		= "additionalPermissionRequestFields.childFirstName"
						options 	= {this.getConditionChildFieldForName()}
					>
						First name child
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "additionalPermissionRequestFields.childLastName"
						options 	= {this.getConditionChildFieldForName()}
					>
						Last name child
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "additionalPermissionRequestFields.childGender"
						options 	= {this.getConditionChildField()}
					>
						Gender child
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "additionalPermissionRequestFields.childDateOfBirth"
						options 	= {this.getConditionChildField()}
					>
						DOB child
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "additionalPermissionRequestFields.childHouse"
						options 	= {this.getConditionChildField()}
					>
						House child
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "additionalPermissionRequestFields.childForm"
						options 	= {this.getConditionChildField()}
					>
						Form child
					</FormField>
				</FormColumn>
				<FormColumn customStyle={'mTwoColumns'}>
					<FormField
						type 		= "text"
						field 		= "name"
						validation 	= "required"
					>
						Name
					</FormField>
					<FormField
						type 		= "textarea"
						field 		= "description"
						validation 	= "any"
					>
						Description
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "status"
						options 	= { SchoolConsts.STATUS_OPTIONS }
						condition 	= { statusActive }
					>
						School Status
					</FormField>
					<FormField
						type 		= "phone"
						field 		= "phone"
						validation 	= "any"
					>
						Phone
					</FormField>
					<FormField
						type			= 'autocomplete'
						serviceFullData	= { this.postcodeService }
						defaultItem		= { selectedPostcode }
						serverField		= { 'postcode' }
						field			= 'postcode'
						onSelect		= { this.onSelectPostcode }
						validation		= 'required'
					>
						Postcode
					</FormField>
					<Map
						key 				= { selectedPostcode ? selectedPostcode.id : 'emptyPostcode' }
						point 				= { this.getPoint() }
						getNewPoint 		= { this.getNewPoint }
					/>
					<FormField
						type 		= "text"
						field 		= "address"
						validation 	= "any"
					>
						Address
					</FormField>
					<FormField
						type 		= "text"
						field 		= "domain"
						validation 	= "domain server"
					>
						Domain
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "region"
						id 			= "school_region"
						options 	= {this.getRegions()}
					>
						Region
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "publicSite.status"
						options 	= { this.getPublicSiteAccessTypes() }
					>
						Public Site Access
					</FormField>
					<FormField
						type			= "text"
						field			= "publicSite.password"
						condition 		= { passActive }
						validation 		= "required"
					>
						Public Site Access Password
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "publicBigscreenSite.status"
						options 	= { this.getPublicSiteAccessTypes() }
					>
						Public Bigscreen Site Access
					</FormField>
					<FormField
						type			= "text"
						field			= "publicBigscreenSite.password"
						condition 		= { passBigscreenActive }
						validation 		= "required"
					>
						Public Bigscreen Site Access Password
					</FormField>
					<FormField
						type 				= "dropdown"
						field 				= "availableForRegistration"
						options 			= { yesNoOptions }
						onBeforeValueSet 	= { value => value === 'true' /*casting back string to boolean*/}
					>
						Available For Reg.
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "triggers.onInviteAction"
						options 	= { SchoolConsts.INVITE_ACTION_OPTIONS }
					>
						Invite Accept Mode
					</FormField>
					<FormField
						type 				= "dropdown"
						field 				= "triggers.onInviteEmailNotification"
						options 			= { yesNoOptions }
						onBeforeValueSet 	= { value => value === 'true' /*casting back string to boolean*/}
					>
						Send Email On New Invite
					</FormField>
					<FormField
						type 		= "dropdown"
						field 		= "subscriptionPlan"
						options 	= { SchoolConsts.SUBSCRIPTION_PLAN_OPTIONS }
					>
						Subscription Plan
					</FormField>
					<FormField
						classNames 	= "mWideSingleLine"
						type 		= "checkbox"
						field 		= "canEditFavoriteSports"
					>
						Can Admin Edit Favorite Sports
					</FormField>
					<FormField
						type 		= "dropdown"
						id 			= "school_age_groups_naming_checkbox"
						field 		= "ageGroupsNaming"
						options 	= { SchoolConsts.AGE_GROUPS_NAMING_OPTIONS }
					>
						Age groups naming
					</FormField>
					<div className="eForm_field">
						<div className="eForm_fieldName">
							Available roles
						</div>
						<MultiselectDropdown
							items			= { RolesHelper.getRoles() }
							selectedItems	= { this.getSelectedRoles() }
							handleClickItem	= { this.handleSelectRole }
							extraStyle		= 'mSmallWide'
						/>
					</div>
				</FormColumn>
			</Form>
		);
	}
});


module.exports = SystemAdminSchoolForm;
