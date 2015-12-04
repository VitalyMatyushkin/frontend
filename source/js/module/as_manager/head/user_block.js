var UserBlock,
	SVG = require('module/ui/svg');

UserBlock = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function() {
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
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			userInfoBinding = binding.sub('userInfo'),
			userId = binding.get('authorizationInfo.userId');

		userId && window.Server.user.get(userId).then(function(data) {
			userInfoBinding.set(Immutable.fromJS(data));
		}, function() {
			window.location.hash = 'logout';
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			authBinding = binding.get('authorizationInfo'),
			authData = authBinding.toJS(),
			AccountButton = null,
			UserButton = null,
			userButtonStyle = {},
			LogoutButton = null,
			LoginButton = null,
			isSettingsPage = document.location.hash.indexOf('settings') !== -1; // Временный костыль для подсветки пункта меню настроек

		// TODO: Заменить данные кнопки на компонент типа Menu
		if (authData && authData.id) {
			// Кнопка перехода на страницу пользователя
			userButtonStyle = {backgroundImage: 'url(' + binding.get('userInfo.avatar') + ')'};
			UserButton = <a href="/#me" className="eTopMenu_photo" style={userButtonStyle}></a>;

			// Кнопка перехода на страницу настрок
			AccountButton =
				<a href="/#settings/general" className={'eTopMenu_item ' + (isSettingsPage ? 'mActive' : '')}><SVG
					icon="icon_cog"/></a>;
			LogoutButton = <a href="/#logout" className="eTopMenu_item mLogout"><SVG icon="icon_logout"/></a>;
		} else {
			// Кнопка авторизации
			LoginButton = <a href="/" className="eTopMenu_item mLogin"><SVG icon="icon_key"/></a>;
		}

		return (
			<div className="bTopMenu mRight">
				{AccountButton}
				{LogoutButton}
				{UserButton}
				{LoginButton}
			</div>
		)
	}
});

module.exports = UserBlock;
