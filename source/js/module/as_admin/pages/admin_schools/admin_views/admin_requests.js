/**
 * Created by bridark on 24/06/15.
 */
var AdminRequest;
AdminRequest = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,binding;
        binding = self.getDefaultBinding();
        window.Server.Permissions.get().then(function(permissions){console.log(permissions)});
    },
    render:function(){
        return <div>Live requests</div>;
    }
});
module.exports = AdminRequest;