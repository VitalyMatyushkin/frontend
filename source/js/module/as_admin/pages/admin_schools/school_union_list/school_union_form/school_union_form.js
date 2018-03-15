const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		Form			= require('module/ui/form/form'),
		FormField		= require('module/ui/form/form_field'),
		FormColumn		= require('module/ui/form/form_column'),
		SchoolConsts	= require('../../../../../helpers/consts/schools');

const SchoolUnionForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title		: React.PropTypes.string.isRequired,
		onSubmit	: React.PropTypes.func
	},
	componentWillMount: function () {
		this.setDefaultPublicSiteAccess();
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
	setDefaultPublicSiteAccess: function() {
		const binding = this.getDefaultBinding();

		if(typeof binding.toJS('publicSite.status') === 'undefined') {
			binding.set(
				'publicSite.status',
				Immutable.fromJS(SchoolConsts.DEFAULT_PUBLIC_ACCESS_SCHOOL_SERVER_VALUE)
			);
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
	render: function () {
		const	binding			= this.getDefaultBinding(),
				rootBinding		= this.getMoreartyContext().getBinding(),
				statusActive	= !rootBinding.get('userRules.activeSchoolId'),
				passActive		= binding.meta().toJS('publicSite.status.value') === 'PROTECTED',
				statusOptions	= [
					{ text: 'Active', value: 'ACTIVE' },
					{ text: 'Inactive', value: 'INACTIVE' },
					{ text: 'Suspended', value: 'SUSPENDED' },
					{ text: 'Email Notifications', value: 'EMAIL_NOTIFICATIONS' }
				],
				yesNoOptions	= [
					{ text: 'Yes',	value: true },
					{ text: 'No',	value: false }
				],
				subscriptionPlanOptions = [
					{text: 'Full', value: SchoolConsts.SCHOOL_SUBSCRIPTION_PLAN.FULL},
					{text: 'Lite', value: SchoolConsts.SCHOOL_SUBSCRIPTION_PLAN.LITE}
				];

		return (
			<Form	name			= { this.props.title }
					binding			= { this.getDefaultBinding() }
					service			= "i/schools/domains"
					onSubmit		= { this.props.onSubmit }
					submitOnEnter	= { false }
			>
				<FormColumn customStyle='col-md-6'>
					<FormField	type		= "imageFile"
								field		= "pic"
								labelText	= "+"
								typeOfFile	= "image"
					/>
					<FormField	type			= "text"
								field			= "email"
								validation		= "email"
								fieldClassName	= "mLarge"
					>
						School Official Email
					</FormField>
					<FormField	type			= "text"
								field			= "sportsDepartmentEmail"
								validation		= "email"
								fieldClassName	= "mLarge"
					>
						Sports Department Email
					</FormField>
					<FormField type="text" field="notificationEmail" validation="email" fieldClassName="mLarge">
						Notification Email
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

				<FormColumn customStyle='col-md-6'>
					<FormField type="text" field="name" validation="required">Name</FormField>
					<FormField type="textarea" field="description" validation="any">Description</FormField>
					<FormField type="dropdown" field="status" options={statusOptions} condition={statusActive}>
						School Status
					</FormField>
					<FormField type="phone" field="phone" validation="any">Phone</FormField>
					<FormField type="text" field="address" validation="any">Address</FormField>
					<FormField type="text" field="domain" validation="domain server">Domain</FormField>
					<FormField	type	= "dropdown"
								field	= "publicSite.status"
								options	= {this.getPublicSiteAccessTypes()}
					>
						Public Site Access
					</FormField>
					<FormField	type			= "password"
								field			= "publicSite.password"
								condition={passActive}
								validation="required"
					>
						Public Site Access Password
					</FormField>
					<FormField	type				= "dropdown"
								field				= "availableForRegistration"
								options				= {yesNoOptions}
								onBeforeValueSet	= { value => value === 'true' /*casting back string to boolean*/}
					>
						Available For Reg.
					</FormField>
					<FormField type="dropdown" field="subscriptionPlan" options={subscriptionPlanOptions}>
						Subscription Plan
					</FormField>
					<FormField type="checkbox" field="canEditFavoriteSports">
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
				</FormColumn>
			</Form>
		);
	}
});

module.exports = SchoolUnionForm;