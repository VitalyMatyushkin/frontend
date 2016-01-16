/**
 * Created by wert on 16.01.16.
 */
const   React           = require('react'),
    RoleSelector    = require('./pages/RoleSelector'),
    UserLogin       = require('module/ui/login/user');

const Center = React.createClass({
    mixins: [Morearty.Mixin],
    // todo: part of dirty fix to make array uniq. Need to use ArrayHelpers on lodash instead.
    onlyUnique: function(value, index, self) {
        return self.indexOf(value) === index;
    },
    componentDidMount: function(){
        const   self    = this,
            binding = this.getDefaultBinding(),
            userId  = this.getDefaultBinding().get('userData.authorizationInfo.userId');
        if(userId) {
            this.getUserRoles(userId).then(data => {
                const uniquePresets = data.map(role => role.preset).filter(self.onlyUnique); // todo: make really unique
                binding.set('userData.availableRoles', uniquePresets);
            });
        }
    },
    getUserRoles: function(userId){
        return window.Server.userPermission.get({
            id: userId
        }).then(result => {
            console.log('User permisions are:' + JSON.stringify(result, null, 2));
            return result;
        });
    },
    isAuthorized: function(){
        const userId = this.getDefaultBinding().get('userData.authorizationInfo.userId');
        return typeof userId !== 'undefined';
    },
    render: function(){
        const binding = this.getDefaultBinding();
        if(this.isAuthorized()) {
            const roles = binding.get('userData.availableRoles') || [];
            console.log('roles:' + JSON.stringify(roles, null, 2));
            return <RoleSelector availableRoles={roles}/>
        } else {
            return <UserLogin binding={binding.sub('userData')}/>
        }
    }

});

module.exports = Center;