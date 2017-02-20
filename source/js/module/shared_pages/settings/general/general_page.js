const	Form			= require('module/ui/form/form'),
		FormColumn 		= require('module/ui/form/form_column'),
		FormField		= require('module/ui/form/form_field'),
		React			= require('react'),
		Morearty        = require('morearty'),
		Immutable		= require('immutable');

const USER = require('module/helpers/consts/user');

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
		const 	self 	= this,
				binding	= self.getDefaultBinding(),
				role 	= self.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role');

		if(!data.birthday)
			data.birthday = null;

		window.Server.profile.put(data).then(data => {
			binding.set(Immutable.fromJS(data));
			if(role){
				window.history.back();
			}
			else {
				window.location.reload();
			}
		});
	},
	
	getGender: function () {
		const gendersArray = [
			{
				text: 'Male',
				value: USER.GENDER.MALE
			},
			{
				text: 'Female',
				value: USER.GENDER.FEMALE
			},
			{
				text: 'Not defined',
				value: USER.GENDER.NOT_DEFINED
			}
		];
		return gendersArray;
	},

	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
				<Form formStyleClass="bSettingsForm mLeft" onSubmit={self.submitEdit} binding={binding} defaultButton="Save" loadingButton="Saving...">
					<FormColumn>
						<h3>YOUR PHOTO</h3>
						<FormField labelText="+" type="imageFile" typeOfFile="image" field="avatar"/>
						<h3>NOTIFICATION SETTINGS</h3>
						<FormField classNames="mSingleLine" type="checkbox" field="notification.sendNews" >Send me news</FormField>
						<FormField classNames="mSingleLine" type="checkbox" field="notification.sendInfoUpdates" >Information updates</FormField>
						<FormField classNames="mSingleLine" type="checkbox" field="notification.sendPromoOffers" >Promotional offers</FormField>
					</FormColumn>
					<FormColumn>
					<h3>SUMMARY</h3>
						<FormField type="text" field="firstName" validation="required alphanumeric">Name</FormField>
						<FormField type="text" field="lastName" validation="required alphanumeric">Surname</FormField>
						<FormField type="dropdown" field="gender" options={self.getGender()}>Gender</FormField>
						<FormField type="date" field="birthday" validation="birthday" >Date of birth</FormField>
						<h3 className="mHigh">VERIFICATION INFORMATION</h3>
						<FormField type="text" field="email" validation="required email" isDisabled={true}>Email</FormField>
						<FormField type="phone" field="phone" validation="phone" isDisabled={true}>Phone number</FormField>
						<br/>
					</FormColumn>
				</Form>
		);
		//	<FormField type="text">Phone code</FormField>
		//<FormField type="text">Email code</FormField>
	}
});


module.exports = GeneralSettingsPage;
