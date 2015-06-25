/**
 * Created by bridark on 19/06/15.
 */
var SchoolRequest;
SchoolRequest = React.createClass({
    mixins:[Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE;
    },
    getDefaultState: function () {
        return Immutable.fromJS({
            PermissionModels: [],
            participants: [],
            sync: false
        });
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');
        //TODO: filter this request down to active school and where accepts = false; instead of getting all permissions
        //Get all permissions for now
        window.Server.Permissions.get()
            .then(function(allPermissions){
                var locArray = [];
                //Now using the principalId fetch some details on the permission from users
                allPermissions.forEach(function (entry) {
                    entry.detail = {};
                    window.Server.user.get({id:entry.principalId})
                        .then(function(detail){
                            entry.detail = detail;
                            locArray.push(entry);
                            binding
                                .atomically()
                                .set('PermissionModels', Immutable.fromJS(locArray))
                                .set('sync', true)
                                .commit();
                        });
                });
            });
    },
    componentDidMount:function(){
        var self =this,
            binding = self.getDefaultBinding();
        //setTimeout(function () {
        //    console.log(binding.toJS('PermissionModels'));
        //},2000);
    },
    _acceptPermission:function(id){
        var self = this,
            binding = self.getDefaultBinding(),
            confirmAcpt = confirm("Are you sure you want to accept?");
        if(confirmAcpt){
            //Perform acceptance logic here
            alert("No API method for this");
        }
    },
    _declinePermission:function(id){
        var self = this,
            binding = self.getDefaultBinding(),
            confirmDec = confirm("Are you sure you want to decline?");
        if(confirmDec){
            //Perform decline logic
            alert("No API method");
        }
    },
    getLiveRequest:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            models = binding.toJS('PermissionModels');
        return models.map(function(entry){
            return (
                    <div className="eDataList_listItem">
                        <div className="eDataList_listItemCell">{entry.detail.firstName+" "+entry.detail.lastName}</div>
                        <div className="eDataList_listItemCell">{entry.detail.email}</div>
                        <div className="eDataList_listItemCell">{entry.detail.phone}</div>
                        <div className="eDataList_listItemCell">{entry.preset}</div>
                        <div className="eDataList_listItemCell">{entry.objectType}</div>
                        <div className="eDataList_listItemCell">{entry.comment}</div>
                        <div className="eDataList_listItemCell mActions">
                            <span onClick={self._acceptPermission.bind(null,entry.id)} className="bButton bButton_req">Accept</span>
                            <span onClick={self._declinePermission.bind(null, entry.id)} className="bButton mRed bButton_req">Decline</span>
                        </div>
                    </div>
                );
        });
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            permissions = self.getLiveRequest();
        return(
            <div><div className="bDataList">
                <div className="eDataList_list mTable">
                    <div className="eDataList_listItem mHead">
                        <div className="eDataList_listItemCell" style={{width:25+'%'}}>Name</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>email</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Phone</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>Roles</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>For</div>
                        <div className="eDataList_listItemCell" style={{width:30+'%'}}>Comment</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Actions</div>
                    </div>
                    {permissions}
                </div>
            </div>
            </div>
        )
    }
});
module.exports = SchoolRequest;