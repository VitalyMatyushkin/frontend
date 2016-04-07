/**
 * Created by Anatoly on 30.03.2016.
 */

const   React 		= require('react'),
        ReactDOM    = require('reactDom'),
        SVG 		= require('module/ui/svg'),
        Immutable 	= require('immutable'),
        classNames  = require('classnames'),
        If          = require('module/ui/if/if'),

RoleList = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes:{
        onlyLogout:React.PropTypes.bool
    },
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
                binding 		= self.getDefaultBinding();

        if(!self.props.onlyLogout) {
            self.addBindingListener(binding, 'roles', function(){
                const roles = binding.get('roles'),
                    activeRoleName  = rootBinding.get('userRules.activeRoleName');

                if (roles && roles.length) {
                    let activeRole = roles.find(r => r.id === activeRoleName);
                    if (!activeRole) {
                        activeRole = roles[0];
                    }
                    binding.set('activeRole', activeRole);
                    self.setRole(activeRole.name, activeRole.permissions[0].schoolId);
                }


            });

            self.getMyRoles();
        }
    },
    getMyRoles:function(){
        const 	self 			= this,
            binding 		= self.getDefaultBinding();

        window.Server.myRoles.get().then(roles => {
            if (roles && roles.length) {
                binding.set('roles', roles);
            }
        });
    },
    setRole:function(roleName){
        const 	self 			= this,
            rootBinding 	= self.getMoreartyContext().getBinding(),
            binding 		= self.getDefaultBinding(),
            role            = binding.get('roles').find(r => r.name === roleName);

        rootBinding.set('userRules.activeRoleName', roleName);
        rootBinding.set('userRules.activeSchoolId', role.schoolId);
        //binding.atomically()
        //    .set('activeRole', role)
        //    .set('listOpen', false)
        //    .commit();
        window.location.reload();
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
    logout:function(){
        window.location.hash = 'logout';
    },
    render: function() {
        const 	self 		= this,
                binding 	= self.getDefaultBinding(),
                listOpen    = binding.get('listOpen'),
                empty       = binding.get('roles').length === 0;

        if(listOpen)
            ReactDOM.findDOMNode(this.refs.role_list).focus();

        return(
            <div className={classNames({bRoleList:true, mLogout:empty})}>
                <If condition={!empty}>
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
                </If>
                <If condition={empty}>
                    <a href="/#logout" className="eTopMenu_item">Log Out</a>
                </If>
            </div>
        );
    }
});

module.exports = RoleList;