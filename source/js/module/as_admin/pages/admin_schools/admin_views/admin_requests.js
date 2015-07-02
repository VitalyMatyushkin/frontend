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
        }).then(function(results){
            console.log(results);
            binding
                .atomically()
                .set('permissionRequests', Immutable.fromJS(results))
                .set('sync',true)
                .commit();
        });
    },
    _getPermissionRequests:function(){
        var self, binding, requestData;
        self = this;
        binding = self.getDefaultBinding();
        requestData = binding.toJS('permissionRequests');
        if(typeof requestData !== 'undefined'){
            return requestData.map(function(request){
                var acceptReq = function(schId,perId,preset,stdId){
                    return function(event){
                        console.log('accept');
                        var confirmAcpt = confirm("Are you sure you want to accept this permission?");
                        if(confirmAcpt === true){
                            if(preset === 'parent'){
                                window.Server.schoolPermission.post({id:schId,permissionId:perId},{accepted:true,data:{studentId:stdId}})
                                    .then(function(res) {
                                        console.log(res);
                                        alert('Permission accepted!');
                                    });
                            }else{
                                window.Server.schoolPermission.post({id:schId,permissionId:perId},{accepted:true})
                                    .then(function(res) {
                                        console.log(res);
                                        alert('Permission accepted!');
                                    });
                            }

                        }
                        event.stopPropagation();
                    }
                };
                var declineReq = function(schId,perId,preset,stdId){
                    return function(event){
                        var confirmAcpt = confirm("Are you sure you want to decline this permission?");
                        if(confirmAcpt === true){
                            if(preset === 'parent'){
                                window.Server.schoolPermission.post({id:schId,permissionId:perId},{accepted:false,data:{studentId:stdId}})
                                    .then(function(res) {
                                        console.log(res);
                                        alert('Permission accepted!');
                                    });
                            }else{
                                window.Server.schoolPermission.post({id:schId,permissionId:perId},{accepted:false})
                                    .then(function(res) {
                                        console.log(res);
                                        alert('Permission accepted!');
                                    });
                            }

                        }
                        event.stopPropagation();
                    }
                };
                if(request.permissions.length >=1){
                    return request.permissions.map(function(role){
                        return (
                            <div className="eDataList_listItem">
                                <div className="eDataList_listItemCell">{request.name}</div>
                                <div className="eDataList_listItemCell">{role.preset}</div>
                                <div className="eDataList_listItemCell">{typeof role.comment !== 'undefined'? role.comment : ''}</div>
                                <div className="eDataList_listItemCell mActions">
                                    <span onClick={acceptReq(request.id,role.id,role.preset,role.studentId)} className="bButton bButton_req">Accept</span>
                                    <span onClick={declineReq(request.id,role.id,role.preset,role.studentId)} className="bButton mRed bButton_req">Decline</span>
                                </div>
                            </div>
                        );
                    });
                }
            });
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            permissionList = self._getPermissionRequests();
        return <div>
                    <div className="bDataList">
                        <div className="eDataList_list mTable">
                            <div className="eDataList_listItem mHead">
                                <div className="eDataList_listItemCell" style={{width:30+'%'}}>School</div>
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>Permission</div>
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>For</div>
                                <div className="eDataList_listItemCell" style={{width:30+'%'}}>Actions</div>
                            </div>
                            {permissionList}
                        </div>
                    </div>
                </div>;
    }
});
module.exports = AdminRequest;