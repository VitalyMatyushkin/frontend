/**
 * Created by Woland on 08.11.2017.
 */
const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
	
		SchoolConsts	= require('module/helpers/consts/schools'),
	
		Popup			= require('module/ui/new_popup'),
		Form			= require('module/ui/form/form'),
		FormField		= require('module/ui/form/form_field');

const LoginPublicBigscreenPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const binding = this.getDefaultBinding();
		
		const publicSchoolAccessType = this.getMoreartyContext().getBinding().toJS('activeSchool.publicBigscreenSite.status');
		
		switch (publicSchoolAccessType) {
			case SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['PROTECTED']:
				// if it was protected, we will show popup
				binding.set('isPasswordPopupOpen', true);
				break;
			case SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['PUBLIC_AVAILABLE']:
				// if it wasn't protected, we will redirect user to the page which he request
				if (
					typeof binding.toJS('hashOfRedirectPageAfterLogin') !== 'undefined' &&
					binding.toJS('hashOfRedirectPageAfterLogin') !== ''
				) {
					document.location.hash = binding.toJS('hashOfRedirectPageAfterLogin');
				} else {
					document.location.hash = 'home';
				}
				break;
			case SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['DISABLED']:
				document.location.hash = '404';
				break;
			default:
				document.location.hash = '404';
				break;
		}
	},
	handleFormSubmit: function(data) {
		const binding = this.getDefaultBinding();
		
		window.Server.publicBigscreenCheckPassword.post(
			{ schoolId:	this.getMoreartyContext().getBinding().toJS('activeSchool.id') },
			data
		).then(response => {
			if(response.isMatch) {
				//if user enter correct password we will redirect user to the page which he request
				if (
					typeof binding.toJS('hashOfRedirectPageAfterLogin') !== 'undefined' &&
					binding.toJS('hashOfRedirectPageAfterLogin') !== ''
				) {
					document.location.hash = binding.toJS('hashOfRedirectPageAfterLogin');
				} else {
					document.location.hash = 'home';
				}
			} else {
				binding.meta().set('password.error',		Immutable.fromJS('Wrong Password'));
				binding.meta().set('password.showError',	Immutable.fromJS('true'));
			}
		});
	},
	
	handleClickClosePopup: function(){
		const binding = this.getDefaultBinding();
		binding.set('isPasswordPopupOpen', false);
	},
	
	render: function(){
		const binding = this.getDefaultBinding();
		
		return (
			<Popup	isOpened				= { Boolean(binding.toJS('isPasswordPopupOpen')) }
					isShowCloseButton		= { false }
					handleClickCloseButton	= { this.handleClickClosePopup }
			>
				<div className="bPublicSchoolFormLogin">
					<h2 className="ePublicSchoolFormLogin_header">Public School Bigscreen Site</h2>
					<Form	binding				= { this.getDefaultBinding() }
							onSubmit			= { this.handleFormSubmit }
							hideCancelButton 	= { true }
					>
						<FormField	type		= "text"
									textType	= "password"
									placeholder	= "Password"
									field		= "password"
									validation	= "required"
									binding		= { binding }
						/>
					</Form>
				</div>
			</Popup>
		);
	}
});

module.exports = LoginPublicBigscreenPage;