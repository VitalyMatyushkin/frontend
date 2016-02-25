/**
 * Created by bridark on 19/06/15.
 */
const   Immutable   = require('immutable'),
        React       = require('react');


const SchoolRequest = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this, binding;
        binding = self.getDefaultBinding();
        var globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        window.Server.schoolPermissions.get({id:activeSchoolId,
            filter: {
                include: ['principal', 'school'],
                where:{and:[{accepted:{neq:true}},{accepted:{neq:false}}]}
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
        var self = this,
            binding = self.getDefaultBinding(),
            requestData = binding.toJS('permissionRequests');

        if (requestData !== undefined) {
            return requestData.map(function (request) {
                var acceptReq = function (permissionId) {
                    return function (event) {
                        var self = this,
                            confirmAcpt = confirm("Are you sure you want to accept this permission?");
                        if (confirmAcpt === true) {
                            var currentPermission = self.getCurrentPermission(permissionId, self.getDefaultBinding().get('permissionRequests').toJS());
                            if(currentPermission.preset === "parent") {
                                document.location.hash = document.location.hash + '/accept?id=' + currentPermission.id;
                            } else {
                                window.Server.setPermissions
                                    .post({id:permissionId},{accepted:true})
                                    .then(function (res) {
                                        window.location.reload(true);
                                    });
                            }
                        }
                        event.stopPropagation();
                    }.bind(self);
                }.bind(self);
                var declineReq = function (permissionId) {
                    return function (event) {
                        var confirmAcpt = confirm("Are you sure you want to decline this permission?");
                        if (confirmAcpt === true) {
							window.Server.setPermissions
								.post({id:permissionId},{accepted:false})
								.then(function (res) {
									//alert('Permission accepted!');
									window.location.reload(true);
								});
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
                var email = request.principal ? request.principal.email : '';
                if (request.accepted == undefined) {
                    return (
                        <div key={request.id} className="eDataList_listItem" onClick={rowClick(request.principalId)}>
                            <div className="eDataList_listItemCell">{request.school.name}</div>
                            <div className="eDataList_listItemCell">
                                    <span className="eChallenge_rivalPic">
                                        <img src={request.school.pic}/>
                                    </span>
                            </div>
                            <div className="eDataList_listItemCell">{email}</div>
                            <div className="eDataList_listItemCell">{request.preset}</div>
                            <div
                                className="eDataList_listItemCell">{request.comment !== undefined ? request.comment : ''}</div>
                            <div className="eDataList_listItemCell mActions">
                                <span
                                    onClick={acceptReq(request.id)}
                                    className="bButton bButton_req">Accept</span>
                                <span
                                    onClick={declineReq(request.id)}
                                    className="bButton mRed bButton_req">Decline</span>
                            </div>
                        </div>
                    );
                }
            });
        }
    },
    getCurrentPermission: function(id, permissions) {
        var permission = undefined;

        for(var i = 0; i < permissions.length; i++) {
            if(permissions[i].id === id) {
                permission = permissions[i];
                break;
            }
        }

        return permission;
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            permissionList = self._getPermissionRequests();
        return <div>
            <div className="eSchoolMaster_wrap">
                <h1 className="eSchoolMaster_title">Live Requests</h1>
                <div className="eStrip">
                </div>
                </div>
            <div className="bDataList">
                <div className="eDataList_list mTable">
                    <div className="eDataList_listItem mHead">
                        <div className="eDataList_listItemCell" style={{width:32+'%'}}>School</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>Emblem</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>Email</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Permission</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Details</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Actions</div>
                    </div>
                    {permissionList}
                </div>
            </div>
        </div>;
    }
});
module.exports = SchoolRequest;