/**
 * Created by bridark on 19/06/15.
 */
var SchoolRequest;
SchoolRequest = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //TODO: filter this request down to active school instead of getting all permissions
        //Get all permissions for now
        window.Server.Permissions.get()
            .then(function(allPermissions){
                console.log(allPermissions);
            });
    },
    render:function(){
        return(
            <div>Live requests go here</div>
        )
    }
});
module.exports = SchoolRequest;