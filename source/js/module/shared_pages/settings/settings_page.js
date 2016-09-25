const 	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		React 		= require('react'),
		Tabs		= require('module/ui/tabs/tabs'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable'),
		GeneralPageComponent 			= require("module/shared_pages/settings/general/general_page"),
		ChangePasswordPageComponent 	= require("module/shared_pages/settings/password/change_password_page"),
		AccountRolesComponent 			= require("module/shared_pages/settings/account/account_roles"),
		AccountRequestsComponent 		= require("module/shared_pages/settings/account/request-list"),
		VerificationStep				= require('./../../ui/register/user/verification_step'),
		If								= require('./../../ui/if/if');


const SettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const self = this,
			binding		= self.getDefaultBinding(),
			rootBinding	= self.getMoreartyContext().getBinding(),
			tab 		= rootBinding.get('routing.pathParameters.0');

		// tabListModel
		self.tabListModel = [{
			text: 'General',
			value: 'general',
			isActive:false
		},
		{
			text:'Roles',
			value:'roles',
			isActive:false
		},
		{
			text:'Requests',
			value:'requests',
			isActive:false
		},
		{
			text:'Change Password',
			value:'password',
			isActive:false
		}];
		if(tab) {
			let item = self.tabListModel.find(t => t.value === tab);
			item.isActive = true;
			binding.set('activeTab', tab);
		} else {
			self.tabListModel[0].isActive = true;
			binding.set('activeTab', 'general');
		}
	},
	changeActiveTab:function(item){
		const	self	= this,
			binding	= self.getDefaultBinding();

		binding.set('activeTab', item);

		window.location.hash = '#settings/' + item;
	},

	getDefaultState: function () {
		return Immutable.fromJS({
			general: {
				generalRouting: {}
			},
			password: {
			},
			permissions: {
				permissionsRouting: {}
			},
			canUserResendEmailVerification:	true,
			canUserResendPhoneVerification:	true,
			isErrorEmailVerification:		false,
			isErrorPhoneVerification:		false,
			settingsRouting:				{}
		});
	},

	getEmail: function() {
		return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.email');
	},
	getPhone: function() {
		return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.phone');
	},
	isEmailVerified: function() {
		return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.verified.email');
	},
	isPhoneVerified: function() {
		return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.verified.phone');
	},

	isErrorEmailVerification: function() {
		return this.getDefaultBinding().toJS('isErrorEmailVerification');
	},
	isErrorPhoneVerification: function() {
		return this.getDefaultBinding().toJS('isErrorPhoneVerification');
	},

	canUserResendEmailVerification: function() {
		return this.getDefaultBinding().toJS('canUserResendEmailVerification');
	},
	canUserResendPhoneVerification: function() {
		return this.getDefaultBinding().toJS('canUserResendPhoneVerification');
	},

	isResentEmailPopupOpen: function() {
		return this.getDefaultBinding().toJS('isResentEmailPopupOpen');
	},
	handleClickEmailPopupClose: function() {
		return this.getDefaultBinding().set('isResentEmailPopupOpen', !this.isResentEmailPopupOpen());
	},
	isResentPhonePopupOpen: function() {
		return this.getDefaultBinding().toJS('isResentPhonePopupOpen');
	},
	handleClickPhonePopupClose: function() {
		return this.getDefaultBinding().set('isResentPhonePopupOpen', !this.isResentPhonePopupOpen());
	},

	handleClickConfirmEmail: function (emailCode) {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				verificationBinding	= self.getMoreartyContext().getBinding().sub('userData.authorizationInfo.verified');

		window.Server.confirmUser.post( {token: emailCode} ).then(data => {
			if(data.confirmed) {
				verificationBinding.set('email', true);
				binding.set('isErrorEmailVerification', false);
			} else {
				binding.set('isErrorEmailVerification', true);
			}
		}).catch(() => {
			binding.set('isErrorEmailVerification', true);
		});
	},
	handleClickConfirmPhone: function (phoneCode) {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				verificationBinding	= self.getMoreartyContext().getBinding().sub('userData.authorizationInfo.verified');

		window.Server.confirmUserPhone.post( {token: phoneCode} ).then(data => {
			if(data.confirmed) {
				verificationBinding.set('phone', true);
				binding.set('isErrorPhoneVerification', false);

				verificationBinding.toJS('email') && self.setStepFunction('permissions');
			} else {
				binding.set('isErrorPhoneVerification', true);
			}
		}).catch(() => {
			binding.set('isErrorPhoneVerification', true);
		});
	},
	handleClickResendEmail: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.profileEmailResend.post()
			.then(data => {
				const interval = new Date(data.nextResendAt).getTime() - new Date().getTime();
				binding.atomically()
					.set('canUserResendEmailVerification',  false)
					.set('isResentEmailPopupOpen',          !this.isResentEmailPopupOpen())
					.commit();
				setTimeout(() => {binding.set('canUserResendEmailVerification', true)}, interval);
			});
	},
	handleSuccessEmailChange: function(newEmail) {
		const	self						= this,
				authorizationInfoBinding	= self.getMoreartyContext().getBinding().sub('userData.authorizationInfo');

		authorizationInfoBinding.set('email', Immutable.fromJS(newEmail));
	},
	handleClickResendPhone: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.profilePhoneResend.post()
			.then(data => {
				const interval = new Date(data.nextResendAt).getTime() - new Date().getTime();
				binding.atomically()
					.set('canUserResendPhoneVerification',  false)
					.set('isResentPhonePopupOpen',          !this.isResentPhonePopupOpen())
					.commit();
				setTimeout(() => {binding.set('canUserResendEmailVerification', true)}, interval);
			});
	},
	handleSuccessPhoneChange: function(newPhone) {
		const   self                        = this,
			authorizationInfoBinding    = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo');

		authorizationInfoBinding.set('phone', Immutable.fromJS(newPhone));
	},


	isSuccessVerified: function() {
		return this.isEmailVerified() && this.isPhoneVerified();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();
		return (
			<div>
				<div className="bSettings_top">
					<div className="bSettings_name">
						<span>{binding.get('userInfo.firstName')}</span>
						<span>{binding.get('userInfo.lastName')}</span>
					</div>
					<If condition={ !this.isSuccessVerified() }>
						<VerificationStep	email							= { this.getEmail() }
											isEmailVerified					= { this.isEmailVerified() }
											isErrorEmailVerification		= { this.isErrorEmailVerification() }
											phone							= { this.getPhone() }
											isPhoneVerified					= { this.isPhoneVerified() }
											isErrorPhoneVerification		= { this.isErrorPhoneVerification() }
											handleClickConfirmEmail 		= { this.handleClickConfirmEmail }
											handleClickConfirmPhone 		= { this.handleClickConfirmPhone }
											handleSuccessEmailChange		= { this.handleSuccessEmailChange }
											handleSuccessPhoneChange		= { this.handleSuccessPhoneChange }
											canUserResendEmailVerification	= { this.canUserResendEmailVerification() }
											canUserResendPhoneVerification	= { this.canUserResendPhoneVerification() }
											handleClickResendEmail			= { this.handleClickResendEmail }
											handleClickResendPhone			= { this.handleClickResendPhone }
											isResentEmailPopupOpen			= { this.isResentEmailPopupOpen() }
											handleClickEmailPopupClose		= { this.handleClickEmailPopupClose }
											isResentPhonePopupOpen			= { this.isResentPhonePopupOpen() }
											handleClickPhonePopupClose		= { this.handleClickPhonePopupClose }
						/>
					</If>
					<If condition={ this.isSuccessVerified() }>
						<Tabs	binding	= {binding.sub('settingsRouting')} tabListModel={self.tabListModel}
								onClick	= {self.changeActiveTab}/>
					</If>
				</div>
				<If condition={ this.isSuccessVerified() }>
					<div className="bSchoolMaster">
						<RouterView routes={ binding.sub('settingsRouting') } binding={globalBinding}>
							<Route
								path="/settings/general"
								binding={binding.sub('userInfo')}
								component={GeneralPageComponent}
							/>
							<Route
								path="/settings/password"
								binding={binding.sub('password')}
								component={ChangePasswordPageComponent}
							/>
							<Route
								path="/settings/roles"
								binding={binding.sub('roles')}
								component={AccountRolesComponent}
							/>
							<Route
								path="/settings/requests /settings/requests/:subPage"
								binding={binding.sub('requests')}
								component={AccountRequestsComponent}
							/>
						</RouterView>
					</div>
				</If>
			</div>
		)
	}
});

module.exports = SettingsPage;