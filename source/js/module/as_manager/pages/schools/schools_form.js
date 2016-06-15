const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		React 		= require('react');


const SchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: 		React.PropTypes.string.isRequired,
		onSubmit: 	React.PropTypes.func
	},
	componentWillUnmount:function(){
		this.getDefaultBinding().clear();
	},
	render: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
                postcode    = binding.toJS('postcode');

		return (
			<Form name={self.props.title} binding={self.getDefaultBinding()} onSubmit={self.props.onSubmit}>
				<FormColumn type="column">
					<FormField labelText="+" type="imageFile" typeOfFile="image" field="pic"/>

					<FormField type="text" field="name" validation="required">Name</FormField>
					<FormField type="text" field="description" validation="required">Description</FormField>
					<FormField type="phone" field="phone" validation="required">Phone</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField type="area" field="postcodeId" defaultItem={postcode} validation="any">Postcode</FormField>
					<FormField type="text" field="address" validation="required">Address</FormField>
					<FormField type="text" field="domain" validation="required">Domain</FormField>
				</FormColumn>
                <FormColumn type="column">
                    <FormField type="text" field="email" validation="required" fieldClassName="mLarge">School Official Email</FormField>
                    <FormField type="text" field="sportsDepartmentEmail" validation="required" fieldClassName="mLarge">Sports Department Email</FormField>
                </FormColumn>
                <FormColumn type="column">
                    <FormField type="dropdown" field="status">School Status</FormField>
                </FormColumn>
			</Form>
		)
	}
});


module.exports = SchoolForm;
