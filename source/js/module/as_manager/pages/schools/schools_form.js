var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	BlazonUpload = require('module/as_manager/pages/albums/view/upload_blazon'),
	React = require('react'),
    If = require('module/ui/if/if'),
	SchoolForm;

SchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onSubmit: React.PropTypes.func
	},
	_serviceFullData:function(){
		return function(){
			return window.Server.postCode.get();
		}
	},
	componentWillUnmount:function(){
		var self = this,
			binding = self.getDefaultBinding();
		binding.clear();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Form name={self.props.title} binding={self.getDefaultBinding()} onSubmit={self.props.onSubmit}>
				<FormColumn type="column">
					<FormField type="text" field="name" validation="required">Name</FormField>
					<FormField type="text" field="description" validation="required">Description</FormField>
					<FormField type="phone" field="phone" validation="phone">Phone</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField type="area" field="postcodeId" serviceFullData={self._serviceFullData()} validation="required">Postcode</FormField>
					<FormField type="text" field="address" validation="required">Address</FormField>
					<FormField type="text" field="domain" validation="required">Domain</FormField>
				</FormColumn>
                <FormColumn type="column">
                    <FormField type="text" field="email" validation="required">School Official Email</FormField>
                    <FormField type="text" field="owner" validation="required">Sports Department Email</FormField>
                </FormColumn>
                <FormColumn type="column">
                    <FormField type="dropdown" field="status" defaultSelect={(binding.get('status')!==undefined?binding.get('status'):'Active')} optionChildren={['Active','Suspended','Inactive','Email Notifications']}>School Status</FormField>
                </FormColumn>
				<FormColumn type="column">
					<FormField type="hidden" field="pic">Upload blazon by clicking on the + button below</FormField>
					<BlazonUpload binding={self.getDefaultBinding().sub('album')}/>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = SchoolForm;
