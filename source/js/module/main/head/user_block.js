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
			OptionsButton = null,
			UserButton = null,
			userButtonStyle = {},
			LoginButton = null;

		if(binding.get('authorizationInfo')) {
			// Кнопка перехода на страницу пользователя
			userButtonStyle = { backgroundImage: 'url(' + binding.get('userInfo.avatar') + ')' };
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
