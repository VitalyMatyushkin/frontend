/**
 * Created by wert on 18.11.16.
 */

const 	Form 			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field'),
		FormColumn 		= require('module/ui/form/form_column'),
		SchoolConsts	= require('../../../helpers/consts/schools'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		React 			= require('react');

const SystemAdminSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: 		React.PropTypes.string.isRequired,
		onSubmit: 	React.PropTypes.func
	},
	componentWillMount: function () {
		this.getDefaultBinding().clear();
		// if it need
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
	// if undefined then set def value
	setDefaultPublicSiteAccess: function() {
		const binding = this.getDefaultBinding();

		if(typeof binding.toJS('publicSite.status') === 'undefined') {
			binding.set(
				'publicSite.status',
				Immutable.fromJS(SchoolConsts.DEFAULT_PUBLIC_ACCESS_SCHOOL_SERVER_VALUE)
			);
		}
	},
	render: function () {
		const 	binding 				= this.getDefaultBinding(),
				rootBinding 			= this.getMoreartyContext().getBinding(),
				statusActive 			= !rootBinding.get('userRules.activeSchoolId'),
				passActive 				= binding.meta().toJS('publicSite.status.value') === 'PROTECTED',
				passBigscreenActive 	= binding.meta().toJS('publicBigscreenSite.status.value') === 'PROTECTED',
				yesNoOptions 			= [
					{ text: 'Yes',	value: true },
					{ text: 'No',	value: false }
				],
				postcode 				= binding.toJS('postcode');

		return (
			<Form
				name 			= { this.props.title }
				binding 		= { this.getDefaultBinding() }
				service 		= "i/schools/domains"
				onSubmit 		= { this.props.onSubmit }
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
						type 			= "area"
						field 			= "postcodeId"
						defaultItem 	= { postcode }
						validation 		= "any"
					>
						Postcode
					</FormField>
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
				</FormColumn>
			</Form>
		);
	}
});


module.exports = SystemAdminSchoolForm;
