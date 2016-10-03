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
	getPublicSiteAccess: function() {
		return this.getDefaultBinding().toJS('publicSite.status');
	},
	// if undefined then set def value
	setDefaultPublicSiteAccess: function() {
		const binding = this.getDefaultBinding();

		if(typeof binding.toJS('publicSite.status') === 'undefined') {
			binding.set(
				'publicSite.status',
				Immutable.fromJS(SchoolConsts.DEFAULT_PUBLIC_ACCESS_SCHOOL_CLIENT_VALUE)
			);
		}
	},
	getPublicSitePasswordCss: function() {
		if(
			this.getDefaultBinding().meta().toJS('publicSite.status.value') !==
			SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE['PROTECTED']
		) {
			return 'mDisabled';
		} else {
			return '';
		}
	},
	render: function () {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				rootBinding = this.getMoreartyContext().getBinding(),
				siteActive 		= !rootBinding.get('userRules.activeSchoolId'),
				passActive 	= siteActive && binding.meta().toJS('publicSite.status.value') === 'PROTECTED',
				statusOptions = [
					'Active',
					'Inactive',
					'Suspended',
					'Email Notifications'
				],
				postcode 	= binding.toJS('postcode');

		return (
			<Form name={self.props.title} binding={self.getDefaultBinding()} service="i/schools/domains" onSubmit={self.props.onSubmit}>
				<FormColumn>
					<FormField type="imageFile" field="pic" labelText="+" typeOfFile="image"/>

					<FormField type="text" field="email" validation="email" fieldClassName="mLarge">
						School Official Email
					</FormField>
					<FormField type="text" field="sportsDepartmentEmail" validation="email" fieldClassName="mLarge">
						Sports Department Email
					</FormField>
				</FormColumn>
				<FormColumn>
					<FormField type="text" field="name" validation="required">Name</FormField>
					<FormField type="textarea" field="description" validation="any">Description</FormField>
					<FormField type="dropdown" field="status" options={statusOptions}>
						School Status
					</FormField>
					<FormField type="phone" field="phone" validation="any">Phone</FormField>
					<FormField type="area" field="postcodeId" defaultItem={postcode}
							   validation="any">Postcode</FormField>
					<FormField type="text" field="address" validation="any">Address</FormField>
					<FormField type="text" field="domain" validation="domain server">Domain</FormField>
					<FormField	type="dropdown"
								field="publicSite.status"
								options={ self.getPublicSiteAccessTypes() }
							  	condition={siteActive}
					>
						Public Site Access
					</FormField>
					<FormField	type			= "password"
								field			= "publicSite.password"
							  	condition={passActive}
					>
						Public School Access Password
					</FormField>
				</FormColumn>
			</Form>
		);
	}
});


module.exports = SchoolForm;
