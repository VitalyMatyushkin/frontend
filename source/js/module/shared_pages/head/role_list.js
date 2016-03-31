/**
 * Created by Anatoly on 30.03.2016.
 */

const   React 		= require('react'),
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
                userId 			= rootBinding.get('userData.authorizationInfo.userId');

        window.Server.userPermissions.get(userId).then(roles => {
            if(roles && roles.length)
            {
                binding.set('roles', roles);
                binding.set('activeRole', roles[0]);
            }
        });
    },
    getRole:function(role, active){
        const   self 	= this,
                school  = role && role.school ? role.school.name : null,
                roleName= role ? role.preset : null,
                id      = role ? role.id : null;

        return (
            <div className="eRole" onClick={active ? self.onSetRole.bind(null, id) : null}>
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
    onSetRole:function(roleId){
        const   self 	= this,
                binding = self.getDefaultBinding(),
                role    = binding.get('roles').find(r => r.id === roleId);

        binding.set('activeRole', role);
    },
    render: function() {
        const 	self 		= this,
                binding 	= self.getDefaultBinding(),
                listOpen    = binding.get('listOpen');


        return(
            <div className={classNames({bRoles:true, mOpen:listOpen})}>
                <div className="eCurrentRole" onClick={self.onToggle}>
                    {self.getActiveRole()}
                    <div className="eArrow">
                        <SVG classes="dropbox_icon" icon="icon_dropbox_arrow" />
                    </div>
                </div>
                <div className="eRolesList">
                    {self.getSelectList()}
                </div>
            </div>
        );
    }
});

module.exports = RoleList;