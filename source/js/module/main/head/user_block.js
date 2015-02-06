var UserBlock,
	SVG = require('module/ui/svg');

UserBlock = React.createClass({
	mixins: [Morearty.Mixin],
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
			UserButton = <a id="jsIsMe" href="/#me" className="eTopMenu_photo mActive" style={userButtonStyle}></a>;

			// Кнопка перехода на страницу настрок
			OptionsButton = <div className="eTopMenu_item"><SVG icon="icon_cog" /></div>;
		} else {
			// Кнопка авторизации
			LoginButton = <a href="/#login" className="eTopMenu_item mLogin"><SVG icon="icon_key" /></a>;
		}

		return (
			<div className="bTopMenu mRight">
				{OptionsButton}
				{UserButton}
				{LoginButton}
			</div>
		)
	}
});

module.exports = UserBlock;
