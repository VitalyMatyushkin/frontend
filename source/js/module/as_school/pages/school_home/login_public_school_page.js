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

		switch (publicSchoolAccessType) {
			case SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['PROTECTED']:
				// if it was protected, we will show popup
				binding.set('isPasswordPopupOpen', true);
				break;
			case SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['PUBLIC_AVAILABLE']:
				// if it wasn't protected, we will redirect user to the page which he request
				if (typeof binding.toJS('hash') !== 'undefined' && binding.toJS('hash') !== '') {
					document.location.hash = binding.toJS('hash');
				} else {
					document.location.hash = 'home';
				}
				break;
			case SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['DISABLED']:
				document.location.hash = '404';
				break;
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
					//if user enter correct password we will redirect user to the page which he request
					if (typeof binding.toJS('hash') !== 'undefined' && binding.toJS('hash') !== '') {
						document.location.hash = binding.toJS('hash');
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
						<h2 className="ePublicSchoolFormLogin_header">Public School Site</h2>
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

module.exports = LoginPublicSchoolPage;