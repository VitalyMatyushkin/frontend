const	Form			= require('module/ui/form/form'),
		FormColumn 		= require('module/ui/form/form_column'),
		FormField		= require('module/ui/form/form_field'),
		React			= require('react'),
		Morearty        = require('morearty'),
		Immutable		= require('immutable'),
		SessionHelper	= require('module/helpers/session_helper'),
		Bootstrap		= require('../../../../../styles/bootstrap-custom.scss');

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
		const self = this;
		const binding = self.getDefaultBinding();
		const role = SessionHelper.getRoleFromSession(
			self.getMoreartyContext().getBinding().sub('userData')
		);

		if(!data.birthday) {
			data.birthday = null;
		}

		window.Server.profile.put(data).then(data => {
			binding.set(
				Immutable.fromJS(data)
			);

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
		const binding = this.getDefaultBinding();

		return (
			<div className="container">
				<Form
					formStyleClass 		= "bSettingsForm mLeft row"
					onSubmit 			= { this.submitEdit }
					binding 			= { binding }
					defaultButton 		= "Save"
					loadingButton 		= "Saving..."
					formButtonsClass 	= 'col-md-10 col-md-offset-1'
				>
					<FormColumn
						customStyle 	="col-md-5 col-md-offset-1"
					>
						<h3>YOUR PHOTO</h3>
						<FormField
							labelText 	= "+"
							type 		= "imageFile"
							typeOfFile 	= "image"
							field 		= "avatar"
						/>
					</FormColumn>
					<FormColumn
						customStyle 	="col-md-5"
					>
					<h3>SUMMARY</h3>
						<FormField
							type 		= "text"
							field 		= "firstName"
							validation 	= "required alphanumeric"
						>
							Name
						</FormField>
						<FormField
							type 		= "text"
							field 		= "lastName"
							validation 	= "required alphanumeric">
							Surname
						</FormField>
						<FormField
							type 		= "dropdown"
							field 		= "gender"
							options 	= { this.getGender() }
						>
							Gender
						</FormField>
						<FormField
							type 		="date"
							field 		="birthday"
							validation 	="birthday"
						>
							Date of birth
						</FormField>
						<h3>VERIFICATION INFORMATION</h3>
						<FormField
							type 			= "text"
							field 			= "email"
							validation 		= "required email"
							isDisabled 		= { true }
						>
							Email
						</FormField>
						<FormField
							type 		="phone"
							field 		="phone"
							validation 	="phone"
							isDisabled 	={ true }
						>
							Phone number
						</FormField>
						<br/>
					</FormColumn>
				</Form>
			</div>
		);
	}
});


module.exports = GeneralSettingsPage;
