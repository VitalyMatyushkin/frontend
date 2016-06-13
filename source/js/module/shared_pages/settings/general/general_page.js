const	Form			= require('module/ui/form/form'),
		FormColumn 		= require('module/ui/form/form_column'),
		FormField		= require('module/ui/form/form_field'),
		React			= require('react'),
		Immutable		= require('immutable');

const GeneralSettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		//binding.clear();
		window.Server.profile.get().then(function (data) {
			binding.set(Immutable.fromJS(data));
		});
	},
	submitEdit: function(data) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		if(!data.password)
			delete data.password;

		window.Server.profile.put(data).then(data => {
			binding.set(Immutable.fromJS(data));
			window.history.back();
		});
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
				<Form formStyleClass="bSettingsForm" onSubmit={self.submitEdit} binding={binding} defaultButton="Save" loadingButton="Saving..." >
					<FormColumn type="column">
						<h3>SUMMARY</h3>
						<FormField labelText="+" type="imageFile" typeOfFile="image" field="avatar"/>
						<FormField type="text" field="firstName" validation="required alphanumeric">Name</FormField>
						<FormField type="text" field="lastName" validation="required alphanumeric">Surname</FormField>
						<FormField type="date" field="birthday">Birthday</FormField>
					</FormColumn>
					<FormColumn type="column">
						<h3>VERIFICATION INFORMATION</h3>
						<FormField type="text" field="email" validation="required email">Email</FormField>
						<FormField type="phone" field="phone" validation="phone">Phone number</FormField>
					</FormColumn>
					<FormColumn type="column">
						<h3>CONFIGURING NOTIFICATIONS</h3>
						<div className="eForm_field">
							<label className="eForm_fieldName">Send me news</label>
							<input className="eSwitch" type="checkbox"></input>
							<label></label>
						</div>
						<div className="eForm_field">
							<label className="eForm_fieldName">Information updates</label>
							<input className="eSwitch" type="checkbox"></input>
							<label></label>
						</div>
						<div className="eForm_field">
							<label className="eForm_fieldName">Promotional offers</label>
							<input className="eSwitch" type="checkbox"></input>
							<label></label>
						</div>
					</FormColumn>
				</Form>
		)
	}
});


module.exports = GeneralSettingsPage;
