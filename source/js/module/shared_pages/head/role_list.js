/**
 * Created by Anatoly on 30.03.2016.
 */

const	React					= require('react'),
		Immutable				= require('immutable'),
		classNames			= require('classnames'),
		Lazy 						= require('lazy.js'),
		If							= require('module/ui/if/if'),
		Morearty				= require('morearty'),
		DomainHelper 		= require('module/helpers/domain_helper'),
		RoleHelper 			= require('module/helpers/role_helper'),
		Auth						= require('module/core/services/AuthorizationServices');


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
				this.getMySchools();
				this.setActivePermission();
			}
		});
	},
	setActivePermission:function(){
		const binding		= this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding();

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
		const	rootBinding		= this.getMoreartyContext().getBinding();

		rootBinding.set('userRules.activeSchoolId', schoolId);
		this.roleBecome(roleName);
	},
	roleBecome:function(roleName){
		Auth.become(roleName).then(() => {
			DomainHelper.redirectToStartPage(roleName);
		});
	},

	getMySchools:function(){
		const binding = this.getDefaultBinding(),
				permissions = binding.toJS('permissions');
	
		const uniqueSchoolIdArray = Lazy(permissions).map(e => e.schoolId).uniq().toArray();

		window.Server.publicSchools.get({filter:{
			limit:1000,
			where: {
				id: {
					$in: uniqueSchoolIdArray
				}
			}
		}}).then(schools => {
			binding.set('schools', Immutable.fromJS(schools));
		});
	},
	renderRole:function(permission, active){
		const binding     = this.getDefaultBinding(),
				schoolId    = permission ? permission.schoolId : null,
				role        = permission ? permission.role : null,
				roleClient 	= permission ? RoleHelper.ROLE_TO_PERMISSION_MAPPING[permission.role] : 'NO ROLE',
				schools     = binding.toJS('schools'),
				school      = schools.length && role !== 'PARENT' ? schools.find(s => s.id === schoolId) : null,
				schoolName  = school ? school.name : null,
				id          = permission ? permission.id : null;

		return (
			<div key={id} className="eRole" onClick={active ? this.onSetRole.bind(null, role, schoolId) : null}>
				<span className="eRole_schoolName" title={schoolName} >{schoolName}</span>
				<span className="eRole_name">{roleClient}</span>
			</div>
		);
	},
	renderActiveRole:function(){
		const binding             = this.getDefaultBinding(),
				activePermission    = binding.toJS('activePermission');

		return this.renderRole(activePermission, false);
	},
	renderSelectList:function(){
		const binding = this.getDefaultBinding(),
				permissions   = binding.toJS('permissions');

		return permissions && permissions.map(p => this.renderRole(p, true));
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
	onSetRole:function(roleName, schoolId){
		const binding     = this.getDefaultBinding();

		this.setRole(roleName, schoolId);
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

		if(listOpen) {
			this.refs.role_list.focus();
		}

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