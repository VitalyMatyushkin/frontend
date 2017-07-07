const 	Form 			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field'),
		FormColumn 		= require('module/ui/form/form_column'),
		SchoolConsts	= require('./../../../helpers/consts/schools'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		React 			= require('react');

const SchoolForm = React.createClass({
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
		const 	binding 	= this.getDefaultBinding(),
				rootBinding = this.getMoreartyContext().getBinding(),
				statusActive = !rootBinding.get('userRules.activeSchoolId'),
				passActive 	= binding.meta().toJS('publicSite.status.value') === 'PROTECTED',
				statusOptions = [
					{ text: 'Active', value: 'ACTIVE' },
					{ text: 'Inactive', value: 'INACTIVE' },
					{ text: 'Suspended', value: 'SUSPENDED' },
					{ text: 'Email Notifications', value: 'EMAIL_NOTIFICATIONS' }
				],
				publicStudentViewOptions = [
					{ text: 'Shorten Last Name only (Brian S.)', value: 'SHORTEN_LASTNAME_ONLY' },
					{ text: 'Shorten First Name and Last Name (B.S.)', value: 'SHORTEN_FIRSTNAME_AND_LASTNAME' }
				],
				postcode 	= binding.toJS('postcode');

		return (
			<div className="container">
				<Form formStyleClass 	= "row"
					  name 				= { this.props.title }
					  binding 			= { this.getDefaultBinding() }
					  service 			= "i/schools/domains"
					  onSubmit 			= { this.props.onSubmit }
					  submitOnEnter 	= { false }
					  formButtonsClass 	= "col-md-10 col-md-offset-1"
					  formTitleClass 	= "col-md-10 col-md-offset-1"
					  submitButtonId 	= "school_summary_submit"
					  cancelButtonId 	= "school_summary_cancel">
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
							options 	= { statusOptions }
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
							options 	={ this.getPublicSiteAccessTypes() }
						>
							Public Site Access
						</FormField>
						<FormField
							type 		= "password"
							id 			= "school_access_password"
							field 		= "publicSite.password"
							condition 	= { passActive }
							validation 	= "required"
						>
							Public Site Access Password
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
							type 		= "dropdown"
							id 			= "school_public_student_view_type_checkbox"
							field 		= "publicStudentViewType"
							options 	= { publicStudentViewOptions }
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
