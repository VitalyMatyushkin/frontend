/**
 * Created by Anatoly on 30.03.2016.
 */

const	React			= require('react'),
		Immutable		= require('immutable'),
		classNames		= require('classnames'),
		Lazy			= require('lazy.js'),
		If				= require('module/ui/if/if'),
		Morearty		= require('morearty'),
		DomainHelper	= require('module/helpers/domain_helper'),
		RoleHelper		= require('module/helpers/role_helper'),
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
			activePermission:	undefined,
			schools:			[]
		});
	},
	componentWillMount: function() {
		if(!this.props.onlyLogout) {
			this.getMyRoles();
		}
	},
	getMyRoles:function(){
		const binding			= this.getDefaultBinding();

		window.Server.roles.get().then(roles => {
			if (roles && roles.length) {
				const permissions = [];

				let isAlreadyHaveParentPermission = false;
				let isAlreadyHaveStudentPermission = false;

				roles.forEach(role => {
					role.permissions.forEach(permission => {
						// Always add all permissions besides PARENT and STUDENT permissions.
						// Add parent and student permissions only at once.
						switch (true) {
							case permission.preset === 'PARENT' && !isAlreadyHaveParentPermission:
								permission.role = role.name;
								permissions.push(permission);
								isAlreadyHaveParentPermission = true;
								break;
							case permission.preset === 'STUDENT' && !isAlreadyHaveStudentPermission:
								permission.role = role.name;
								permissions.push(permission);
								isAlreadyHaveStudentPermission = true;
								break;
							case permission.preset === 'PARENT' && isAlreadyHaveParentPermission:
								break;
							case permission.preset === 'STUDENT' && isAlreadyHaveStudentPermission:
								break;
							default:
								permission.role = role.name;
								permissions.push(permission);
						}
					});
				});
				binding.set('permissions', Immutable.fromJS(permissions));
				this.setActivePermission();
			}
		});
	},
	setActivePermission:function(){
		const	binding		= this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding();

		const	activeRoleName	= rootBinding.toJS('userData.authorizationInfo.role'),
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
		Auth.become(roleName);
	},
	renderRole:function(permission, active){
		const	role			= permission.role,
				roleClientView	= RoleHelper.ROLE_TO_PERMISSION_MAPPING[permission.role],
				schoolName		= role !== 'PARENT' && role !== 'STUDENT' ? permission.school.name : null;

		return (
			<div	key			={permission.id}
					className	="eRole"
					onClick		={active ? this.onSetRole.bind(null, role, permission.school) : null}
			>
				<span className="eRole_schoolName" title={schoolName}>{schoolName}</span>
				<span className="eRole_name">{roleClientView}</span>
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
		const binding     = this.getDefaultBinding(),
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
		window.location.hash = 'logout';
	},
	render: function() {
		const	binding 	= this.getDefaultBinding(),
				role        = this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role'),
				listOpen    = binding.toJS('listOpen'),
				show        = !!binding.toJS('permissions').length && !!role;


		return(
			<div className={classNames({bRoleList:true, mLogout:!show})}>
				<If condition={show}>
					<div className={classNames({bRoles:true, mOpen:listOpen})} tabIndex="-1" ref="role_list" onBlur={this.onBlur}>
						<div onClick={this.onToggle}>
							<div className="eArrow"></div>
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