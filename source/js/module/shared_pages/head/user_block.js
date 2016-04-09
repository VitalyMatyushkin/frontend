const 	React 		= require('react'),
		SVG 		= require('module/ui/svg'),
		Immutable 	= require('immutable'),
        RoleList    = require('./role_list'),

UserBlock = React.createClass({
	mixins: [Morearty.Mixin],
    propTypes:{
        asAdmin:React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            asAdmin: false
        };
    },
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

		//userId && window.Server.user.get(userId).then(function(data) {
		//	userInfoBinding.set(Immutable.fromJS(data));
		//}, function() {
		//	window.location.hash = 'logout';
		//});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			authBinding = binding.get('authorizationInfo'),
			authData = authBinding.toJS(),
			UserButton = null,
			userButtonStyle = {},
			LoginButton = null,
            RolesList = null;

		// TODO: Заменить данные кнопки на компонент типа Menu
		if (authData && authData.id) {
			// Кнопка перехода на страницу пользователя
			userButtonStyle = {backgroundImage: 'url(' + binding.get('userInfo.avatar') + ')'};
			UserButton = <a href="/#settings/general" className="eTopMenu_photo" style={userButtonStyle} />;
            RolesList = <RoleList binding={binding.sub('roleList')} onlyLogout={self.props.asAdmin} />;
		} else {
			// Кнопка авторизации
			LoginButton = <a href="/" className="eTopMenu_item mLogin"><SVG icon="icon_key"/></a>;
		}

		return (
			<div className="bTopMenu mRight">
                {RolesList}
				{UserButton}
				{LoginButton}
			</div>
		)
	}
});

module.exports = UserBlock;
