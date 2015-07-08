/**
 * Created by bridark on 19/06/15.
 */
var SchoolRequest;
SchoolRequest = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this, binding;
        binding = self.getDefaultBinding();
        var globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        window.Server.schoolPermissions.get({id:activeSchoolId,
            filter: {
                include: ['principal', 'school']
            }
        }).then(function (results) {
            binding
                .atomically()
                .set('permissionRequests', Immutable.fromJS(results))
                .set('sync', true)
                .commit();
        });
    },
    _getPermissionRequests: function () {
        var self, binding, requestData;
        self = this;
        binding = self.getDefaultBinding();
        requestData = binding.toJS('permissionRequests');
        if (requestData !== undefined) {
            return requestData.map(function (request) {
                var acceptReq = function (permissionId, principalId, preset, schoolId, studentId) {
                    return function (event) {
                        var confirmAcpt = confirm("Are you sure you want to accept this permission?");
                        if (confirmAcpt === true) {
                            if (preset === 'parent') {
                                window.Server.updateUserPermission.put({
                                    id: principalId,
                                    fk: permissionId
                                }, {accepted: true, data: {studentId: studentId}})
                                    .then(function (res) {
                                        // alert('Permission accepted!');
                                        window.location.reload(true);
                                    });
                            } else {
                                window.Server.updateUserPermission.put({
                                    id: principalId,
                                    fk: permissionId
                                }, {accepted: true})
                                    .then(function (res) {
                                        //alert('Permission accepted!');
                                        window.location.reload(true);
                                    });
                            }

                        }
                        event.stopPropagation();
                    }
                };
                var declineReq = function (permissionId, principalId, preset, schoolId, studentId) {
                    return function (event) {
                        var confirmAcpt = confirm("Are you sure you want to decline this permission?");
                        if (confirmAcpt === true) {
                            if (preset === 'parent') {
                                window.Server.updateUserPermission({
                                    id: principalId,
                                    fk: permissionId
                                }, {accepted: false, data: {studentId: studentId}})
                                    .then(function (res) {
                                        alert('Permission accepted!');
                                    });
                            } else {
                                window.Server.updateUserPermission({
                                    id: principalId,
                                    fk: permissionId
                                }, {accepted: false})
                                    .then(function (res) {
                                        alert('Permission accepted!');
                                    });
                            }

                        }
                        event.stopPropagation();
                    }
                };
                var rowClick = function (principalId) {
                    return function (e) {
                        document.location.hash = '/admin_schools/admin_views/user?id=' + principalId;
                        e.stopPropagation();
                    }
                };
                if (request.accepted == undefined) {
                    return (
                        <div className="eDataList_listItem" onClick={rowClick(request.principalId)}>
                            <div className="eDataList_listItemCell">{request.school.name}</div>
                            <div className="eDataList_listItemCell">
                                    <span className="eChallenge_rivalPic">
                                        <img src={request.school.pic}/>
                                    </span>
                            </div>
                            <div className="eDataList_listItemCell">{request.principal.email}</div>
                            <div className="eDataList_listItemCell">{request.preset}</div>
                            <div
                                className="eDataList_listItemCell">{request.comment !== undefined ? request.comment : ''}</div>
                            <div className="eDataList_listItemCell mActions">
                                <span
                                    onClick={acceptReq(request.id,request.principalId,request.preset,request.schoolId,request.studentId)}
                                    className="bButton bButton_req">Accept</span>
                                <span
                                    onClick={declineReq(request.id,request.principalId,request.preset,request.schoolId,request.studentId)}
                                    className="bButton mRed bButton_req">Decline</span>
                            </div>
                        </div>
                    );
                }
            });
        }
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            permissionList = self._getPermissionRequests();
        return <div>
            <div className="bDataList">
                <div className="eDataList_list mTable">
                    <div className="eDataList_listItem mHead">
                        <div className="eDataList_listItemCell" style={{width:32+'%'}}>School</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>Emblem</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>Email</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Permission</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>For</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Actions</div>
                    </div>
                    {permissionList}
                </div>
            </div>
        </div>;
    }
});
module.exports = SchoolRequest;