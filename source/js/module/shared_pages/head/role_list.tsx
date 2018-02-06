/**
 * Created by Anatoly on 30.03.2016.
 */

import * as React from 'react';
import * as	Morearty from 'morearty';
import * as	Immutable from 'immutable';
import * as BPromise from 'bluebird';

import {If} from 'module/ui/if/if'
import * as	classNames from 'classnames';
import {AuthorizationServices} from 'module/core/services/AuthorizationServices';

import * as RoleListHelper from './role_list_helper';
import * as	RoleHelper from 'module/helpers/role_helper';
import * as	SessionHelper from 'module/helpers/session_helper';

const RoleList = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function(){
		return Immutable.Map({
			listOpen:			false,
			permissions:		[],
			activePermission:	undefined,
			schools:			[]
		});
	},
	componentWillMount: function() {
		if(!this.props.onlyLogout) {
			this.setMyRoles();
		}
	},
	setMyRoles:function(){
		const binding = this.getDefaultBinding();

		RoleListHelper.getUserRoles().then(permissions => {
			binding.set('permissions', Immutable.fromJS(permissions));
			this.setActivePermission();
		});
	},
	setActivePermission:function(){
		const	binding		= this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding();

		const	activeRoleName	= SessionHelper.getRoleFromSession( rootBinding.sub('userData') ),
				activeSchoolId	= rootBinding.toJS('userRules.activeSchoolId'),
				permissions		= binding.toJS('permissions'),
				arr				= permissions ? permissions.filter(p => p.role === activeRoleName):[];

		let schoolId = activeSchoolId;
		if(arr.length) {
			let activePermission = arr.find(p => p.schoolId === activeSchoolId);
			if(!activePermission){
				activePermission = arr[0];
				schoolId = activePermission.schoolId;
			}
			rootBinding.set('userRules.activeSchoolId', schoolId);
			binding.set('activePermission', Immutable.fromJS(activePermission));
		}
	},
	setRole:function(roleName, school){
		const rootBinding = this.getMoreartyContext().getBinding();

		rootBinding.set('userRules.activeSchoolId', school.id);
		this.roleBecome(roleName, school.kind);
	},
	roleBecome:function(roleName){
		AuthorizationServices.become(roleName).then(() => window.location.reload());
	},
	renderRole:function(permission, active: boolean){
		const	role			= permission.role,
				roleClientView	= RoleHelper.ROLE_TO_PERMISSION_MAPPING[permission.role],
				schoolName		= role !== 'PARENT' && role !== 'STUDENT' ? permission.school.name : null;

		return (
			<div
				key			= { permission.id }
				className	= "eRole"
				onClick		= { active ? this.onSetRole.bind(null, role, permission.school) : null }
			>
				<span
					className	= "eRole_schoolName"
					title		= { schoolName }
				>
					{ schoolName }
				</span>
				<span
					className="eRole_name"
				>
					{ roleClientView }
				</span>
			</div>
		);
	},
	renderActiveRole:function(){
		const	binding				= this.getDefaultBinding(),
				activePermission	= binding.toJS('activePermission');

		if(typeof activePermission !== "undefined") {
			return this.renderRole(activePermission, false);
		} else {
			return null;
		}
	},
	renderSelectList:function(){
		const	binding		= this.getDefaultBinding(),
				permissions	= binding.toJS('permissions');

		if(typeof permissions !== "undefined") {
			return permissions.map(p => this.renderRole(p, true));
		} else {
			return null;
		}
	},
	onToggle:function(e){
		const   binding     = this.getDefaultBinding(),
			    listOpen    = binding.toJS('listOpen');

		binding.set('listOpen', Immutable.fromJS(!listOpen));

		e.stopPropagation();
	},
	onBlur:function(e){
		const binding     = this.getDefaultBinding();

		/**in IE11 onBlur is triggered faster than onClick, and onClick not triggered */
		setTimeout(function(){
			binding.set('listOpen', Immutable.fromJS(false));
		}, 100);

		e.stopPropagation();
	},
	onSetRole:function(roleName, school){
		const binding     = this.getDefaultBinding();

		this.setRole(roleName, school);
		binding.set('listOpen', Immutable.fromJS(false));
	},
	logout:function(){
		const 	globalBinding 		= this.getMoreartyContext().getBinding(),
				roleSession 		= SessionHelper.getRoleSession(globalBinding.sub('userData')),
				roleSessionKey 		= roleSession.id,
				loginSession 		= SessionHelper.getLoginSession(globalBinding.sub('userData')),
				loginSessionKey 	= loginSession.id;

		const 	deleteRoleSessionPromise 	= (window as any).Server.sessionKey.delete({ key: roleSessionKey }),
				deleteLoginSessionPromise 	= (window as any).Server.sessionKey.delete({ key: loginSessionKey });

		BPromise.all([deleteRoleSessionPromise, deleteLoginSessionPromise]).finally(() => {
			window.location.hash = 'logout';
		});
	},
	render: function() {
		const	binding		= this.getDefaultBinding(),
				role		= SessionHelper.getRoleFromSession(
					this.getMoreartyContext().getBinding().sub('userData')
				),
				listOpen	= binding.toJS('listOpen');

		const show = (
			typeof binding.toJS('permissions') !== 'undefined' &&
			!!binding.toJS('permissions').length &&
			!!role
		);


		return(
			<div className={classNames({bRoleList:true, mLogout:!show})}>
				<If condition={show}>
					<div className={classNames({bRoles:true, mOpen:listOpen})} tabIndex={-1} ref="role_list" onBlur={this.onBlur}>
						<div onClick={this.onToggle}>
							<div className="eArrow"/>
							{this.renderActiveRole()}
						</div>
						<div className="eRolesList">
							<div className="eScrollList">
								{this.renderSelectList()}
							</div>
							<div className="eRole mLogout" onClick={this.logout}>
								Log Out
							</div>
						</div>
					</div>
				</If>
				<If condition={!show}>
					<a href="/#logout" className="eTopMenu_item">Log Out</a>
				</If>
			</div>
		);
	}
});

module.exports = RoleList;