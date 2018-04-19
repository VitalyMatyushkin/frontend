import * as React from 'react';
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';

import * as BPromise from 'bluebird';
import * as bowser from 'bowser';

import * as LoginForm from '../../ui/login/user/form';
import * as LoginError from '../../ui/login/user/error';
import {RoleSelector} from '../../as_login/pages/RoleSelector';

import * as ApplicationLinks from '../../ui/application_links/application_links';
import {SVG} from '../../ui/svg';

import {AuthorizationServices} from 'module/core/services/AuthorizationServices';
import * as RoleHelper from 'module/helpers/role_helper';
import * as RoleListHelper from 'module/shared_pages/head/role_list_helper';
import * as SessionHelper from 'module/helpers/session_helper';
import * as ApplicationConst from 'module/helpers/consts/application_links';

const LoginUserPage2 = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			showError:		false,
			isRememberMe:	false,
			isSync:			false
		});
	},
	componentWillMount: function() {
		const binding	= this.getDefaultBinding();

		this.getMoreartyContext().getBinding().sub('userRules').set('activeSchoolId', null);

		const domain = window.location.host.split('.')[0];

		this.formName = domain === 'admin' ? 'Administrator Login' : 'default';

		let promise = true;

		if(this.isAuthorized() && !this.isOnRole()) {
			promise = this.setPermissions();
		}

		BPromise.resolve(promise).then(() => binding.set('isSync', Immutable.fromJS(true)));
	},
	onSuccess: function() {
		if(this.isAuthorized()) {
			this.setPermissions();
		}
	},
	showError: function() {
		if(this.isAuthorized()) {
			this.setPermissions();
		} else{
			this.getDefaultBinding().set('showError', true);
		}
	},
	hideError: function() {
		this.getDefaultBinding().set('showError', false);
	},
	onSingUp: function() {
		document.location.hash = 'register';
		this.hideError();
	},
	setPermissions: function() {
		const binding = this.getDefaultBinding();

		return RoleListHelper.getUserRoles()
			.then(permissions => {
				binding.set(
					'roleList',
					Immutable.fromJS({
						permissions: permissions
					})
				);

				const roleList = this.getRoleListByPermissionList(permissions);
				let promise;
				if(roleList.length == 0) {
					promise = AuthorizationServices.become('NOBODY');
				} else if(roleList.length == 1) {
					promise = AuthorizationServices.become(roleList[0]).then(() => window.location.reload());
				} else {
					promise = true;
				}

				return promise;
			});
	},
	isAuthorized: function() {
		return typeof SessionHelper.getUserIdFromSession(
			this.getDefaultBinding()
		) !== 'undefined';
	},
	isOnRole: function() {
		return typeof SessionHelper.getRoleFromSession(
			this.getDefaultBinding()
		) !== 'undefined';
	},
	renderCurrentView: function() {
		let currentView = null;
		
		const	showError	= this.getDefaultBinding().toJS('showError'),
				permissions	= this.getDefaultBinding().toJS('roleList.permissions');

		switch (true) {
			case showError === true:
				currentView = (
					<LoginError	onOk		= {this.hideError}
								onSingUp	= {this.onSingUp}
					/>
				);
				break;
			case showError === false && typeof permissions !== 'undefined':
				currentView = (
					<RoleSelector
						roleList={ this.getRoleListByPermissionList(permissions) }
					/>
				);
				break;
			case showError === false:
				currentView = (
					<LoginForm
						customName			= { this.formName }
						onError				= { this.showError }
						onSuccess			= { this.onSuccess }
						onChangeRememberMe	= { this.onChangeRememberMe }
						binding				= { this.getDefaultBinding() }
					/>
				);
				break;
		}
		return currentView;
	},
	getRoleListByPermissionList: function (permissions) {
		const roleList = [];

		if(
			typeof permissions !== 'undefined' &&
			permissions.length > 0
		) {
			Object.keys(RoleHelper.USER_ROLES).forEach(role => {
				if(permissions.findIndex(p => p.role === role) !== -1) {
					roleList.push(role);
				}
			});
		}

		return roleList;
	},
	isFirstVisitFromMobile: function(){
		const isFirstVisit = typeof this.getDefaultBinding().get('isFirstVisit') === 'undefined';
		return isFirstVisit && bowser.mobile;
	},
	onChangeRememberMe: function () {
		const binding = this.getDefaultBinding();

		binding.set('isRememberMe', !binding.toJS('isRememberMe'));
	},
	onClickWebVersion: function() {
		const binding = this.getDefaultBinding();
		binding.set('isFirstVisit', false);
	},
	onClickIOSVersion: function () {
		window.open(ApplicationConst.APPLICATION_LINKS.IOS);
	},
	onClickAndroidVersion: function () {
		window.open(ApplicationConst.APPLICATION_LINKS.ANDROID);
	},
	render: function() {
		const isSync = this.getDefaultBinding().toJS('isSync');

		let content = null;
		switch (true) {
			case (
				isSync &&
				this.isFirstVisitFromMobile()
			): {
				content = (
					<div className="bPageMessage">
						<SVG classes="bLoginIcon" icon="icon_login"/>
						<ApplicationLinks
							onClickWebVersion 		= {this.onClickWebVersion}
							onClickIOSVersion 		= {this.onClickIOSVersion}
							onClickAndroidVersion 	= {this.onClickAndroidVersion}
						/>
					</div>
				);
				break;
			}
			case isSync: {
				content = (
					<div className="bPageMessage">
						<SVG classes="bLoginIcon" icon="icon_login"/>
						{this.renderCurrentView()}
					</div>
				);
				break;
			}
		}

		return content;
	}
});

module.exports = LoginUserPage2;