/**
 * Created by Anatoly on 30.03.2016.
 */

const	React			= require('react'),
		Immutable		= require('immutable'),
		classNames		= require('classnames'),
		If				= require('module/ui/if/if'),
		Morearty        = require('morearty'),
		DomainHelper 	= require('module/helpers/domain_helper'),
		RoleHelper 		= require('module/helpers/role_helper'),
		Auth			= require('module/core/services/AuthorizationServices');


const  RoleList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		onlyLogout:React.PropTypes.bool
	},
	getDefaultState:function(){
		return Immutable.Map({
			listOpen:			false,
			permissions:		[],
			activePermission:	null,
			schools:			[]
		});
	},
	componentWillMount: function() {
		const self = this;

		if(!self.props.onlyLogout) {
			self.getMyRoles();
			self.getMySchools();
		}
	},
	getMyRoles:function(){
		const	self			= this,
				binding			= self.getDefaultBinding();

		window.Server.roles.get().then(roles => {
			if (roles && roles.length) {
				const permissions = [];

				let isAlreadyHaveParentPermission = false;

				roles.forEach(role => {
					role.permissions.forEach(permission => {
						// Always add all permissions besides PARENT permissions.
						// Add parent permissions only at once.
						if(permission.preset !== 'PARENT' || permission.preset === 'PARENT' && !isAlreadyHaveParentPermission) {
							permission.role = role.name;
							permissions.push(permission);
						}

						// If permissions array already has PARENT permission, set isAlreadyHaveParentPermission flag to true
						if(permission.preset === 'PARENT' && !isAlreadyHaveParentPermission) {
							isAlreadyHaveParentPermission = true;
						}
					});
				});
				binding.set('permissions', Immutable.fromJS(permissions));
				self.setActivePermission();
			}
		});
	},
	setActivePermission:function(){
		const	self		= this,
				binding		= self.getDefaultBinding(),
				rootBinding	= self.getMoreartyContext().getBinding();

		const	activeRoleName	= rootBinding.toJS('userData.authorizationInfo.role'),
				activeSchoolId	= rootBinding.toJS('userRules.activeSchoolId'),
				permissions		= binding.toJS('permissions'),
				arr				= permissions ? permissions.filter(p => p.role === activeRoleName):[];

		let schoolId = activeSchoolId;
		if(arr.length){
			let activePermission = arr.find(p => p.schoolId === activeSchoolId);
			if(!activePermission){
				activePermission = arr[0];
				schoolId = activePermission.schoolId;
			}
			//if(activePermission.preset === 'PARENT') {
			//	schoolId = null; //TODO: event not open with activeSchoolId = null
			//}
			rootBinding.set('userRules.activeSchoolId', schoolId);
			binding.set('activePermission', Immutable.fromJS(activePermission));
		}
	},
	setRole:function(roleName, schoolId){
		const	self 			= this,
				rootBinding		= self.getMoreartyContext().getBinding();

		rootBinding.set('userRules.activeSchoolId', schoolId);
		self.roleBecome(roleName);
	},
	roleBecome:function(roleName){
		Auth.become(roleName).then(() => {
			DomainHelper.redirectToStartPage(roleName);
		});
	},
	getMySchools:function(){
		const 	self 	= this,
				binding = self.getDefaultBinding();

		window.Server.publicSchools.get().then(schools => {
			binding.set('schools', Immutable.fromJS(schools));
		});
	},
	renderRole:function(permission, active){
		const   self 	    = this,
				binding     = self.getDefaultBinding(),
				schoolId    = permission ? permission.schoolId : null,
				role        = permission ? permission.role : null,
				roleClient 	= permission ? RoleHelper.SERVER_ROLE_FOR_CLIENT[permission.role] : 'NO ROLE',
				schools     = binding.toJS('schools'),
				school      = schools.length && role !== 'PARENT' ? schools.find(s => s.id === schoolId) : null,
				schoolName  = school ? school.name : null,
				id          = permission ? permission.id : null;

		return (
			<div key={id} className="eRole" onClick={active ? self.onSetRole.bind(null, role, schoolId) : null}>
				<p>{schoolName}</p>
				<p className="eRole_name">{roleClient}</p>
			</div>
		);
	},
	renderActiveRole:function(){
		const   self 	            = this,
				binding             = self.getDefaultBinding(),
				activePermission    = binding.toJS('activePermission');

		return self.renderRole(activePermission, false);
	},
	renderSelectList:function(){
		const   self 	= this,
				binding = self.getDefaultBinding(),
				permissions   = binding.toJS('permissions');

		return permissions && permissions.map(p => self.renderRole(p, true));
	},
	onToggle:function(e){
		const   self 	    = this,
				binding     = self.getDefaultBinding(),
				listOpen    = binding.toJS('listOpen');

		binding.set('listOpen', Immutable.fromJS(!listOpen));

		e.stopPropagation();
	},
	onBlur:function(e){
		const   self 	    = this,
				binding     = self.getDefaultBinding();

		/**in IE11 onBlur is triggered faster than onClick, and onClick not triggered */
		setTimeout(function(){
			binding.set('listOpen', Immutable.fromJS(false));
		}, 100);

		e.stopPropagation();
	},
	onSetRole:function(roleName, schoolId){
		const   self 	    = this,
				binding     = self.getDefaultBinding();

		self.setRole(roleName, schoolId);
		binding.set('listOpen', Immutable.fromJS(false));
	},
	logout:function(){
		window.location.hash = 'logout';
	},
	render: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				role        = self.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role'),
				listOpen    = binding.toJS('listOpen'),
				show        = !!binding.toJS('permissions').length && !!role,
				hidden      = !binding.toJS('schools').length && !role && !self.props.onlyLogout;

		if(listOpen)
			this.refs.role_list.focus();

		return(
			<div className={classNames({bRoleList:true, mLogout:!show, mHidden:hidden})}>
				<If condition={show}>
					<div className={classNames({bRoles:true, mOpen:listOpen})} tabIndex="-1" ref="role_list" onBlur={self.onBlur}>
						<div onClick={self.onToggle}>
							{self.renderActiveRole()}
							<div className="eArrow eCombobox_button">

							</div>
						</div>
						<div className="eRolesList">
							<div className="eScrollList">
								{self.renderSelectList()}
							</div>
							<div className="eRole mLogout" onClick={self.logout}>
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