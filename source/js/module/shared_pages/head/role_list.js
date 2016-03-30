/**
 * Created by Anatoly on 30.03.2016.
 */

const   React 		= require('react'),
        Select      = require('module/ui/select/select'),

RoleList = React.createClass({
    mixins: [Morearty.Mixin],

    componentWillMount: function() {
        const 	self 			= this,
                rootBinding 	= self.getMoreartyContext().getBinding(),
                binding 		= self.getDefaultBinding(),
                userId 			= rootBinding.get('userData.authorizationInfo.userId');

        window.Server.userPermissions.get(userId).then(roles => {
            binding.set('roles', roles);
        });
    },
    getRolesArray:function(){
        const   self 	= this,
                binding = self.getDefaultBinding(),
                roles   = binding.get('roles'),
                result  = [];
    },
    render: function() {
        const 	self 			= this,
            binding 		= self.getDefaultBinding();

        return(
            <Select binding={binding.sub('selectRole')} />
        );
    }
});

module.exports = RoleList;