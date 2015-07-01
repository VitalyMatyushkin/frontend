/**
 * Created by bridark on 24/06/15.
 */
var AdminRequest;
AdminRequest = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,binding;
        binding = self.getDefaultBinding();
        window.Server.schools.get({
            filter:{
                include:{
                    relation:'permissions'
                }
            }
        }).then(function(results){console.log(results)});
    },
    render:function(){
        return <div>Live requests</div>;
    }
});
module.exports = AdminRequest;