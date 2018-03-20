const 	Form 			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field'),
		FormColumn 		= require('module/ui/form/form_column'),
		SchoolConsts	= require('./../../../helpers/consts/schools'),
		SchoolHelper    = require('module/helpers/school_helper'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		React 			= require('react');

const SchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:          React.PropTypes.string.isRequired,
		onSubmit:       React.PropTypes.func,
		isSuperAdmin:   React.PropTypes.bool.isRequired
	},
	componentWillMount: function () {
		this.getDefaultBinding().clear();

		if(!this.props.isSuperAdmin) {
			window.Server.school.get(MoreartyHelper.getActiveSchoolId(this)).then(school => {
				this.activeSchoolInfo = school;
			});
		}

		// if it need
		this.setDefaultPublicSiteAccess();
		this.setDefaultPublicBigscreenSiteAccess();
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
	/**
	 * Function is something like middleware for form dropdown
	 * If function returns false then field doesn't change value
	 * @param accessType
	 * @returns {boolean}
	 */
	handleSchoolAccessSelect: function(accessType) {
		let result = true;

		if(!this.props.isSuperAdmin) {
			if(accessType === 'PUBLIC_AVAILABLE' && !this.activeSchoolInfo.canPublishWebSite) {
				SchoolHelper.showSubscriptionPlanAlert();
				result = false;
			} else {
				result = true;
			}
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
	setDefaultPublicBigscreenSiteAccess: function() {
		const binding = this.getDefaultBinding();

		if(typeof binding.toJS('publicBigscreenSite.status') === 'undefined') {
			binding.set(
				'publicBigscreenSite.status',
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
				postcode 				= binding.toJS('postcode');

		return (
			<div className="container">
				<Form
					formStyleClass 		= "row"
					name 				= { this.props.title }
					binding 			= { this.getDefaultBinding() }
					service 			= "i/schools/domains"
					onSubmit 			= { this.props.onSubmit }
					submitOnEnter 		= { false }
					formButtonsClass 	= "col-md-10 col-md-offset-1"
					formTitleClass 		= "col-md-10 col-md-offset-1"
					submitButtonId 		= "school_summary_submit"
					cancelButtonId 		= "school_summary_cancel">
					<FormColumn customStyle="col-md-5 col-md-offset-1">
						<FormField
							type 		= "imageFile"
							field 		= "pic"
							labelText 	= "+"
							typeOfFile 	= "image"
						/>
						<FormField
							type 			= "text"
							field 			= "email"
							id 				= "school_official_email"
							validation 		= "email"
							fieldClassName 	= "mLarge"
						>
							School Official Email
						</FormField>
						<FormField
							type 			= "text"
							field 			= "sportsDepartmentEmail"
							id 				= "school_department_email"
							validation 		= "email"
							fieldClassName 	 = "mLarge"
						>
							Sports Department Email
						</FormField>
					</FormColumn>

					<FormColumn customStyle="col-md-5">
						<FormField
							type 		= "text"
							field 		= "name"
							id 			= "school_name"
							validation 	= "required"
							isDisabled 	= { !this.props.isSuperAdmin }
						>
							Name
						</FormField>
						<FormField
							type 		= "textarea"
							field 		= "description"
							id 			= "school_description"
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
							id 			= "school_phone"
							validation 	= "any"
						>
							Phone
						</FormField>
						<FormField
							type 			= "area"
							field 			= "postcodeId"
							id 				= "school_postcode"
							defaultItem 	= { postcode }
							validation 		= "any"
						>
							Postcode
						</FormField>
						<FormField
							type 		= "text"
							field 		= "address"
							id 			= "school_address"
							validation 	= "any"
						>
							Address
						</FormField>
						<FormField
							type 		= "text"
							field 		= "domain"
							id 			= "school_domain"
							validation 	= "domain server"
						>
							Domain
						</FormField>
						<FormField
							type 		= "dropdown"
							field 		= "publicSite.status"
							id 			= "school_access_select"
							options 	= {this.getPublicSiteAccessTypes()}
							onSelect    = {this.handleSchoolAccessSelect}
						>
							Public Site Access
						</FormField>
						<FormField
							type 		= "text"
							id 			= "school_access_password"
							field 		= "publicSite.password"
							condition 	= { passActive }
							validation 	= "required"
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
							classNames 	= "mSingleLine"
							type 		= "checkbox"
							id 			= "school_registration_checkbox"
							field 		= "studentSelfRegistrationEnabled"
						>
							Student registration
						</FormField>
						<FormField
							classNames 	= "mSingleLine"
							type 		= "checkbox"
							id 			= "createS_student_from_parent_permission"
							field 		= "canCreateStudentFromParentPermissionRequest"
						>
							Admin can create student from parent permission request
						</FormField>
						<FormField
							type 		= "dropdown"
							id 			= "school_public_student_view_type_checkbox"
							field 		= "publicStudentViewType"
							options 	= { SchoolConsts.PUBLIC_STUDENT_VIEW_OPTIONS }
						>
							Public student view type
						</FormField>
					</FormColumn>
				</Form>
			</div>
		);
	}
});


module.exports = SchoolForm;
