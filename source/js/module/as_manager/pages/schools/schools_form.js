const 	Form 			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field'),
		FormColumn 		= require('module/ui/form/form_column'),
		SchoolConsts	= require('./../../../helpers/consts/schools'),
		If				= require('./../../../ui/if/if'),
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
		return SchoolConsts.PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY;
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
				postcode 	= binding.toJS('postcode');

		return (
			<Form name={self.props.title} binding={self.getDefaultBinding()} onSubmit={self.props.onSubmit}>
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
					<FormField type="dropdown" field="status">School Status</FormField>
					<FormField type="phone" field="phone" validation="phone">Phone</FormField>
					<FormField type="area" field="postcodeId" defaultItem={postcode}
							   validation="any">Postcode</FormField>
					<FormField type="text" field="address" validation="any">Address</FormField>
					<FormField type="text" field="domain" validation="domain">Domain</FormField>
					<FormField	type="dropdown"
								field="publicSite.status"
								userActiveState={ self.getPublicSiteAccess() }
								userProvidedOptions={ self.getPublicSiteAccessTypes() }
					>
						Public School Access
					</FormField>
					<FormField	type			= "password"
								field			= "publicSite.password"
								fieldClassName	= { this.getPublicSitePasswordCss() }
					>
						Public School Access Password
					</FormField>
				</FormColumn>
			</Form>
		);
	}
});


module.exports = SchoolForm;
