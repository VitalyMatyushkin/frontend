const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		Form			= require('module/ui/form/form'),
		FormField		= require('module/ui/form/form_field'),
		FormColumn		= require('module/ui/form/form_column'),
		SchoolConsts	= require('./../../../../../../helpers/consts/schools');

const SchoolUnionForm = React.createClass({
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
		const	self 		= this,
				binding 	= self.getDefaultBinding(),
				rootBinding = this.getMoreartyContext().getBinding(),
				statusActive = !rootBinding.get('userRules.activeSchoolId'),
				passActive 	= binding.meta().toJS('publicSite.status.value') === 'PROTECTED',
				statusOptions = [
					{ text: 'Active', value: 'ACTIVE' },
					{ text: 'Inactive', value: 'INACTIVE' },
					{ text: 'Suspended', value: 'SUSPENDED' },
					{ text: 'Email Notifications', value: 'EMAIL_NOTIFICATIONS' }
				];

		return (
			<div className="container">
				<div className="row">
					<Form name={self.props.title}
						  binding={self.getDefaultBinding()}
						  service="i/schools/domains"
						  onSubmit={self.props.onSubmit}
						  submitOnEnter={false}
						  formButtonsClass='col-md-10 col-md-offset-1'
						  formTitleClass="col-md-10 col-md-offset-1"
						>
						<FormColumn customStyle="col-md-5 col-md-offset-1">
							<FormField type="imageFile" field="pic" labelText="+" typeOfFile="image"/>

							<FormField type="text"
									   field="email"
									   validation="email"
									   fieldClassName="mLarge"
								>
								School Union Official Email
							</FormField>
							<FormField type="text"
									   field="sportsDepartmentEmail"
									   validation="email"
									   fieldClassName="mLarge">
								Sports Union Department Email
							</FormField>
						</FormColumn>
						<FormColumn customStyle="col-md-5">
							<FormField type="text"
									   field="name"
									   validation="required"
								>
								Name
							</FormField>
							<FormField type="textarea" field="description" validation="any">Description</FormField>
							<FormField type="dropdown" field="status" options={statusOptions} condition={statusActive}>
								School Status
							</FormField>
							<FormField type="phone" field="phone" validation="any">Phone</FormField>
							<FormField type="text" field="address" validation="any">Address</FormField>
							<FormField type="text" field="domain" validation="domain server">Domain</FormField>
							<FormField type="dropdown"
									   field="publicSite.status"
									   options={ self.getPublicSiteAccessTypes() }
								>
								Public Site Access
							</FormField>
							<FormField type="password"
									   field="publicSite.password"
									   condition={passActive}
									   validation="required"
								>
								Public Site Access Password
							</FormField>
						</FormColumn>
					</Form>
				</div>
			</div>
		);
	}
});

module.exports = SchoolUnionForm;