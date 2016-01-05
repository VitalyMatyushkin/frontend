/**
 * Created by bridark on 29/06/15.
 */
var RevokeAccess, React ,ReactDOM;
React = require('react');
ReactDOM = require('reactDom');
RevokeAccess = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
    },
    _confirmYes:function(){
        var self, binding;
        self = this;
        binding = self.getDefaultBinding();
        return function(evt){
            console.log('confirmed yes');
            window.Server.Permissions.get({
                filter:{
                    where:{
                        principalId:binding.get('selectedUser').userId
                    }
                }
            }).then(function(permissions){
                console.log(permissions);
                //TODO:Better API method for this - for efficiency
                permissions.forEach(function(p){
                    window.Server.Permission.delete({id:p.id}).then(function(response){
                        console.log(response);
                        binding.set('popup',false);
                        binding.set('shouldUpdateList',true);
                    });
                });
            });
            evt.stopPropagation();
        }
    },
    _confirmNo:function(){
        var self, binding;
        self = this;
        binding = self.getDefaultBinding();
        return function(evt){
            console.log('confirmed no');
            //binding.set('shouldUpdateList',true);
            evt.stopPropagation();
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            currentUser = binding.get('selectedUser').userName;
        return (
            <div style={{float:'left', width:100+'%'}}>
                <div style={{padding:10+'px', borderBottom: 1+'px solid #eeeeee'}}>Attention!</div>
                <div style={{padding:10+'px'}}>
                    Are you sure you want to revoke all permissions for {currentUser} ?
                </div>
                <div style={{padding:10+'px'}}>
                    <span onClick={self._confirmYes()} className="bButton" style={{float:'right', margin:10+'px'}}>Yes</span>
                    <span onClick={self._confirmNo()} className="bButton" style={{float:'right', margin:10+'px'}}>No</span>
                </div>
            </div>
        );
    }
});
module.exports = RevokeAccess;