const 	React 			= require('react'),
		SVG 			= require('module/ui/svg'),
		Immutable 		= require('immutable'),
		RoleList		= require('./role_list'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		classNames		= require('classnames');

const UserBlock = React.createClass({
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
				email: ''
			}
		});
	},
	componentWillMount: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				userInfoBinding	= binding.sub('userInfo');

		const	userId		= binding.get('authorizationInfo.userId');

		if(userId) {
			window.Server.profile.get().then(data => {
				userInfoBinding.set(Immutable.fromJS(data));
			});
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			authData = binding.toJS('authorizationInfo'),
			UserButton = null,
            userClasses = classNames({
                eTopMenu_photo:true,
                mDisabled:self.props.asAdmin
            }),
			LoginButton = null,
            RolesList = null;

		// TODO: Заменить данные кнопки на компонент типа Menu
		if (authData && authData.id) {
			// Кнопка перехода на страницу пользователя
			const avatar = binding.get('userInfo.avatar');
			if(avatar) {
				const userButtonStyle = {
					backgroundImage: `url(${binding.get('userInfo.avatar')})`
				};
				UserButton = <a href="/#settings/general" className={userClasses} style={userButtonStyle} />;
			} else {
				UserButton = (
					<a href="/#settings/general" className={userClasses}>
						<div className="eTopMenu_avatar_plug_wrapper">
							<SVG icon="icon_avatar_plug"/>
						</div>
					</a>
				);
			}

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
