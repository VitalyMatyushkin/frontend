const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		Popup			= require('./../../../ui/new_popup'),
		SchoolConsts	= require('./../../../helpers/consts/schools'),
		Form			= require('module/ui/form/form'),
		FormField		= require('module/ui/form/form_field');

const LoginPublicSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		const publicSchoolAccessType = this.getMoreartyContext().getBinding().toJS('activeSchool.publicSite.status');

		if(publicSchoolAccessType === SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['PROTECTED']) {
			// if it was protected, we will show popup
			binding.set('isPasswordPopupOpen', true);
		} else {
			// if it wasn't protected, we will redirect user to public page
			document.location.hash = 'home';
		}
	},
	handleFormSubmit: function(data) {
		const binding = this.getDefaultBinding();

		window.Server.publicSchoolCheckPassword.post(
			{
				schoolId:	this.getMoreartyContext().getBinding().toJS('activeSchool.id')
			},
			data
		).then(response => {
			if(response.isMatch) {
				document.location.hash = 'home';
			} else {
				binding.meta().set('password.error',		Immutable.fromJS('Wrong Password'));
				binding.meta().set('password.showError',	Immutable.fromJS('true'));
			}
		});
	},
	render: function(){
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
				<Popup	isOpened				= { binding.toJS('isPasswordPopupOpen') }
						isShowCloseButton		= { false }
						handleClickCloseButton	= { this.handleClickCloseChangePhonePopup }
				>
					<div className="bPublicSchoolFormLogin">
						<h2 className="ePublicSchoolFormLogin_header">Public School Site</h2>
						<Form binding={ this.getDefaultBinding() } onSubmit={ this.handleFormSubmit }>
							<FormField type="text" textType="password" placeholder="Password" field="password" validation="required" binding={binding}/>
						</Form>
					</div>
				</Popup>
		);
	}
});

module.exports = LoginPublicSchoolPage;