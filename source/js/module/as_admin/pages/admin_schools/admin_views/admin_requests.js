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
        var self, binding, requestData,roleList;
        self = this;
        binding = self.getDefaultBinding();
        requestData = binding.toJS('permissionRequests');
        if(typeof requestData !== 'undefined'){
            return requestData.map(function(request){
                if(request.permissions.length >=1){
                    return request.permissions.map(function(role){
                        return (
                            <div className="eDataList_listItem">
                                <div className="eDataList_listItemCell">{request.name}</div>
                                <div className="eDataList_listItemCell">{role.preset}</div>
                                <div className="eDataList_listItemCell">{typeof role.comment !== 'undefined'? role.comment : ''}</div>
                                <div className="eDataList_listItemCell mActions">
                                    <span className="bButton bButton_req">Accept</span>
                                    <span className="bButton mRed bButton_req">Decline</span>
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
                                <div className="eDataList_listItemCell" style={{width:25+'%'}}>School</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>Permission</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>For</div>
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>Actions</div>
                            </div>
                            {permissionList}
                        </div>
                    </div>
                </div>;
    }
});
module.exports = AdminRequest;