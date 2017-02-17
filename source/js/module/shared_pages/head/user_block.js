// @flow

const 	React 			= require('react'),
		SVG 			= require('module/ui/svg'),
		Immutable 		= require('immutable'),
		Morearty        = require('morearty'),
		RoleList		= require('./role_list'),
		Avatar 			= require('module/ui/avatar/avatar'),
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
		let		self = this,
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
			UserButton = (
				<a href="/#settings/general" className={userClasses}>
					<Avatar pic={binding.get('userInfo.avatar')} minValue={50} />
				</a>
			);

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
