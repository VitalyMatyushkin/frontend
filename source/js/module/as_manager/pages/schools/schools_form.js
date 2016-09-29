const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		Morearty	= require('morearty'),
		React 		= require('react');


const SchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: 		React.PropTypes.string.isRequired,
		onSubmit: 	React.PropTypes.func
	},
	componentWillUnmount: function () {
		this.getDefaultBinding().clear();
	},
	render: function () {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
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
					<FormField type="dropdown" field="status">School Status</FormField>
					<FormField type="phone" field="phone" validation="phone">Phone</FormField>
					<FormField type="area" field="postcodeId" defaultItem={postcode}
							   validation="any">Postcode</FormField>
					<FormField type="text" field="address" validation="any">Address</FormField>
					<FormField type="text" field="domain" validation="domain server">Domain</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = SchoolForm;
