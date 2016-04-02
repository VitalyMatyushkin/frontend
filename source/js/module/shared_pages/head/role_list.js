/**
 * Created by Anatoly on 30.03.2016.
 */

const   React 		= require('react'),
        ReactDOM    = require('reactDom'),
        SVG 		= require('module/ui/svg'),
        Immutable 	= require('immutable'),
        classNames  = require('classnames'),

RoleList = React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultState:function(){
        return Immutable.Map({
            listOpen:false,
            roles:[],
            activeRole:null
        });
    },
    componentWillMount: function() {
        const 	self 			= this,
                rootBinding 	= self.getMoreartyContext().getBinding(),
                binding 		= self.getDefaultBinding(),
                userId 			= rootBinding.get('userData.authorizationInfo.userId'),
                activeRoleId    = rootBinding.get('userRules.activeRoleId');

        window.Server.userPermissions.get(userId).then(roles => {
            if(roles && roles.length)
            {
                let activeRole = roles.find(r => r.id === activeRoleId);
                if(!activeRole){
                    activeRole = roles[0];
                    rootBinding.set('userRules.activeRoleId', activeRole.id);
                }
                binding.set('roles', roles);
                binding.set('activeRole', activeRole);
            }
        });
    },
    getRole:function(role, active){
        const   self 	= this,
                school  = role && role.school ? role.school.name : null,
                roleName= role ? role.preset : null,
                id      = role ? role.id : null;

        return (
            <div key={id} className="eRole" onClick={active ? self.onSetRole.bind(null, id) : null}>
                <p>{school}</p>
                <p>{roleName}</p>
            </div>
        );
    },
    getActiveRole:function(){
        const   self 	    = this,
                binding     = self.getDefaultBinding(),
                activeRole  = binding.get('activeRole');

        return self.getRole(activeRole, false);
    },
    getSelectList:function(){
        const   self 	= this,
                binding = self.getDefaultBinding(),
                roles   = binding.get('roles');

        return roles && roles.map(r => self.getRole(r, true));
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
    onSetRole:function(roleId){
        const 	self 			= this,
                rootBinding 	= self.getMoreartyContext().getBinding(),
                binding 		= self.getDefaultBinding(),
                role            = binding.get('roles').find(r => r.id === roleId);

        rootBinding.set('userRules.activeRoleId', roleId);
        rootBinding.set('userRules.activeSchoolId', role.schoolId);
        //binding.atomically()
        //    .set('activeRole', role)
        //    .set('listOpen', false)
        //    .commit();
        window.location.reload();
    },
    logout:function(){
        window.location.hash = 'logout';
    },
    render: function() {
        const 	self 		= this,
                binding 	= self.getDefaultBinding(),
                listOpen    = binding.get('listOpen');

        //if(listOpen)
        //    ReactDOM.findDOMNode(this.refs.eCurrentRole).focus();
        //
        //return(
        //    <div className={classNames({bRoles:true, mOpen:listOpen})}>
        //        <div tabIndex="-1" ref="eCurrentRole" onBlur={self.onBlur} onClick={self.onToggle}>
        if(listOpen)
            ReactDOM.findDOMNode(this.refs.role_list).focus();

        return(
            <div className={classNames({bRoles:true, mOpen:listOpen})} tabIndex="-1" ref="role_list" onBlur={self.onBlur}>
                <div onClick={self.onToggle}>
                    {self.getActiveRole()}
                    <div className="eArrow">
                        <SVG classes="dropbox_icon" icon="icon_dropbox_arrow" />
                    </div>
                </div>
                <div className="eRolesList">
                    <div className="eScrollList">
                        {self.getSelectList()}
                    </div>
                    <div className="eRole mLogout" onClick={self.logout}>
                        Log Out
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = RoleList;