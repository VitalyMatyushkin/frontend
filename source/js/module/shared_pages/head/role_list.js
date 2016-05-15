/**
 * Created by Anatoly on 30.03.2016.
 */

const	React		= require('react'),
		SVG			= require('module/ui/svg'),
		Immutable	= require('immutable'),
		classNames	= require('classnames'),
		If			= require('module/ui/if/if'),
		RoleHelper	= require('module/helpers/role_helper'),
		Auth		= require('module/core/services/AuthorizationServices');


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
				binding			= self.getDefaultBinding(),
				rootBinding		= self.getMoreartyContext().getBinding();

		const	activeRoleName	= rootBinding.get('userData.authorizationInfo.role'),
				activeSchoolId	= rootBinding.get('userRules.activeSchoolId');

		window.Server.roles.get().then(roles => {
			if (roles && roles.length) {
				const permissions = [];

				roles.forEach(role => {
					role.permissions.forEach(permission => {
						permission.role = role.name;
						permissions.push(permission);
					});
				});
				binding.set('permissions', permissions);
				self.setActivePermission();
			}
		});
	},
	setActivePermission:function(){
		const	self		= this,
				binding		= self.getDefaultBinding(),
				rootBinding	= self.getMoreartyContext().getBinding();

		const	activeRoleName	= rootBinding.get('userData.authorizationInfo.role'),
				activeSchoolId	= rootBinding.get('userRules.activeSchoolId'),
				permissions		= binding.get('permissions'),
				arr				= permissions ? permissions.filter(p => p.role === activeRoleName):[];

		if(arr.length){
			let activePermission = arr.find(p => p.schoolId === activeSchoolId);
			if(!activePermission){
				activePermission = arr[0];
				rootBinding.set('userRules.activeSchoolId', activePermission.schoolId);
			}
			binding.set('activePermission', activePermission);
		}
	},
	setRole:function(roleName, schoolId){
		const	self 			= this,
				rootBinding		= self.getMoreartyContext().getBinding();

		rootBinding.set('userRules.activeSchoolId', schoolId);
		self.roleBecome(roleName);
	},
	roleBecome:function(roleName){
		const self = this;

		Auth.become(roleName).then(() => {
			self.redirectToStartPage(roleName);
		});
	},
	getRoleSubdomain: function(roleName) {
		return RoleHelper.roleMapper[roleName.toLowerCase()];
	},
	redirectToStartPage: function(roleName) {
		const self = this;

		const roleSubdomain = self.getRoleSubdomain(roleName);

		if(roleSubdomain) {
			let subdomains = document.location.host.split('.');
			subdomains[0] = roleSubdomain;
			const domain = subdomains.join(".");
			let newUrl = window.location.href;
			switch (roleSubdomain) {
				case 'manager':
					newUrl = `http://${domain}/#school_admin/summary`;
					break;
				case 'parents':
					newUrl = `http://${domain}/#events/calendar/all`;
					break;
			}
			if(newUrl === window.location.href)
				window.location.reload();
			else
				window.location.href = newUrl;

		} else {
			alert('unknown role: ' + roleName);
		}
	},
	getMySchools:function(){
		const 	self 	= this,
				binding = self.getDefaultBinding();

		window.Server.publicSchools.get().then(schools => {
			binding.set('schools', schools);
		});
	},
	renderRole:function(permission, active){
		const   self 	    = this,
				binding     = self.getDefaultBinding(),
				schoolId    = permission ? permission.schoolId : null,
				schools     = binding.get('schools'),
				school      = schools.length ? schools.find(s => s.id === schoolId) : null,
				schoolName  = school ? school.name : null,
				role        = permission ? permission.role : 'NO ROLE',
				id          = permission ? permission.id : null;

		return (
			<div key={id} className="eRole" onClick={active ? self.onSetRole.bind(null, role, schoolId) : null}>
				<p>{schoolName}</p>
				<p>{role}</p>
			</div>
		);
	},
	renderActiveRole:function(){
		const   self 	            = this,
				binding             = self.getDefaultBinding(),
				activePermission    = binding.get('activePermission');

		return self.renderRole(activePermission, false);
	},
	renderSelectList:function(){
		const   self 	= this,
				binding = self.getDefaultBinding(),
				permissions   = binding.get('permissions');

		return permissions && permissions.map(p => self.renderRole(p, true));
	},
	onToggle:function(e){
		const   self 	    = this,
				binding     = self.getDefaultBinding(),
				listOpen    = binding.get('listOpen');

		binding.set('listOpen', !listOpen);

		e.stopPropagation();
	},
	onBlur:function(e){
		const   self 	    = this,
				binding     = self.getDefaultBinding();

		binding.set('listOpen', false);

		e.stopPropagation();
	},
	onSetRole:function(roleName, schoolId){
		const   self 	    = this,
				binding     = self.getDefaultBinding();

		self.setRole(roleName, schoolId);
		binding.set('listOpen', false);
	},
	logout:function(){
		window.location.hash = 'logout';
	},
	render: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				role        = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.role'),
				listOpen    = binding.get('listOpen'),
				show        = !!binding.get('permissions').length,
				hidden      = !binding.get('schools').length && !role && !self.props.onlyLogout;

		if(listOpen)
			this.refs.role_list.focus();

		return(
			<div className={classNames({bRoleList:true, mLogout:!show, mHidden:hidden})}>
				<If condition={show}>
					<div className={classNames({bRoles:true, mOpen:listOpen})} tabIndex="-1" ref="role_list" onBlur={self.onBlur}>
						<div onClick={self.onToggle}>
							{self.renderActiveRole()}
							<div className="eArrow">
								<SVG classes="dropbox_icon" icon="icon_dropbox_arrow" />
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