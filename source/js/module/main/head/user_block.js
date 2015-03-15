var UserBlock,
	SVG = require('module/ui/svg');

UserBlock = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
        return Immutable.fromJS({
            userInfo: {
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                avatar: 'http://lorempixel.com/640/480/sports'
            }
        });
    },
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            userInfoBinding = binding.sub('userInfo'),
            userId = binding.get('authorizationInfo.userId');

		userId && window.Server.me.get(userId).then(function (data) {
            userInfoBinding.set(Immutable.fromJS(data));
        });
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			authBinding = binding.get('authorizationInfo'),
			authData = authBinding.toJS(),
			OptionsButton = null,
			UserButton = null,
			userButtonStyle = {},
			LogoutButton = null,
			LoginButton = null,
			isSettingsPage = document.location.hash.indexOf('settings') !== -1; // Временный костыль для подсветки пункта меню настроек

		// TODO: Заменить данные кнопки на компонент типа Menu
		if(authData && authData.id) {
			// Кнопка перехода на страницу пользователя
			userButtonStyle = { backgroundImage: 'url(' + binding.get('userInfo.avatar') + ')' };
			UserButton = <a id="jsIsMe" href="/#me" className="eTopMenu_photo" style={userButtonStyle}></a>;

			// Кнопка перехода на страницу настрок
			OptionsButton = <a href="/#settings/general" className={'eTopMenu_item ' + (isSettingsPage ? 'mActive' : '')}><SVG icon="icon_cog" /></a>;

			// Logout button
			LogoutButton = <a href="/#logout" className="eTopMenu_item mLogin"><SVG icon="icon_logout" /></a>;
		} else {
			// Кнопка авторизации
			LoginButton = <a href="/#login" className="eTopMenu_item mLogin"><SVG icon="icon_key" /></a>;
		}

		return (
			<div className="bTopMenu mRight">
				{OptionsButton}
				{LogoutButton}
				{UserButton}
				{LoginButton}
			</div>
		)
	}
});

module.exports = UserBlock;
