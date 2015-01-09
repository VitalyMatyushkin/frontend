var UserBlock,
	SVG = require('module/ui/svg'),
	RegisterModal = require('module/main/head/user_block/register_modal');

UserBlock = React.createClass({
	mixins: [Morearty.Mixin],
	toggleRegisterModal: function(){
		var self = this,
			binding = self.getDefaultBinding().sub('registerModal');

		binding.set('isOpened', !binding.get('isOpened'));
	},
	loginUser: function(loginData) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('authorizationInfo', loginData);
		binding.sub('registerModal').set('isOpened', false);
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			OptionsButton = null,
			UserButton = null,
			userButtonStyle = {},
			LoginButton = null;

		if(binding.get('authorizationInfo')) {
			// Кнопка перехода на страницу пользователя
			userButtonStyle = { backgroundImage: 'url(https://pp.vk.me/c10133/v10133740/7d/Q4t3uQ3hBWQ.jpg)' };
			UserButton = <a id="jsIsMe" href="/" className="eTopMenu_photo mActive" style={userButtonStyle}></a>;

			// Кнопка перехода на страницу настрок
			OptionsButton = <div className="eTopMenu_item"><SVG icon="icon_cog" /></div>;
		} else {
			// Кнопка авторизации
			LoginButton = <span onClick={this.toggleRegisterModal} className="eTopMenu_item mLogin"><SVG icon="icon_key" /></span>;
		}

		return (
			<div className="bTopMenu mRight">
				{OptionsButton}
				{UserButton}
				{LoginButton}
				<RegisterModal binding={ binding.sub('registerModal') } onLoginDone={self.loginUser} onRequestClose={self.toggleRegisterModal}/>
			</div>
		)
	}
});

module.exports = UserBlock;
