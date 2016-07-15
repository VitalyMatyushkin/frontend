/**
 * Created by bridark on 24/06/15.
 */
const   Table           = require('module/ui/list/table'),
        TableField      = require('module/ui/list/table_field'),
        DateTimeMixin   = require('module/mixins/datetime'),
        React           = require('react'),
        If              = require('module/ui/if/if'),
        Lazy            = require('lazy.js'),
        Morearty        = require('morearty'),
        MoreartyHelper	= require('module/helpers/morearty_helper'),
        ListPageMixin   = require('module/mixins/list_page_mixin');

const AdminRequest = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin,DateTimeMixin],
    getDefaultProps: function() {
        return {
            serviceName:'permissionRequests',
            serviceCount:'permissionRequestsCount'
        };
    },
    setPageTitle:"New Requests",
    groupActionList:['Accept','Decline'],
    // TODO shitty way
    // pls see below to _getDataPromise
    //filters:{include:['principal','school'],where:{status:'NEW'}},
    componentWillMount:function(){
        const self = this;

        self.updateSubMenu();
        self.getSchools();
    },
    // TODO shitty way
    // yep, ListPageMixin use field "filters", which you see above, but server still doesn't understand filter
    // so we should filter permissions by our hands
    // let's go my friend
    _getDataPromise: function() {
        const self = this;

        // About activeSchoolId pls look at comment from AdminRequest._getQuickEditActionFunctions
        return window.Server.permissionRequests.get(MoreartyHelper.getActiveSchoolId(self), {
                filter: {
                    limit: 1000
                }
            })
            .then(permissions => {
                return permissions.filter(permission => permission.status === "NEW");
            });
    },
    _getTotalCountPromise: function() {
        const self = this;

        // About activeSchoolId pls look at comment from AdminRequest._getQuickEditActionFunctions
        return window.Server.permissionRequests.get(MoreartyHelper.getActiveSchoolId(self), {
                filter: {
                    limit: 1000
                }
            })
            .then(permissions => {
                return permissions.filter(permission => permission.status === "NEW");
            })
            .then(permissions => {
                return permissions.length;
            });
    },
    getSchools:function(){
        const 	self 	= this,
            binding = self.getDefaultBinding();

        window.Server.publicSchools.get().then(schools => {
            binding.set('schools', schools);
        });
    },
    getSchoolEmblem:function(permission){
        const self = this,
            binding = self.getDefaultBinding(),
            schools = binding.get('schools'),
            school = schools && permission ? schools.find(s => s.id === permission.schoolId) : null;

        if(school && school.pic){
            return <span className="eChallenge_rivalPic"><img src={window.Server.images.getResizedToBoxUrl(school.pic, 60, 60)}/></span>;
        }
    },
    getSchoolName:function(permission){
        const self = this,
            binding = self.getDefaultBinding(),
            schools = binding.get('schools'),
            school = schools && permission ? schools.find(s => s.id === permission.schoolId) : null;

        if(school){
            return school.name;
        }
    },
    updateSubMenu:function(){
        const   self            = this,
                globalBinding   = self.getMoreartyContext().getBinding();

        globalBinding.set('submenuNeedsUpdate', !globalBinding.get('submenuNeedsUpdate'));
    },
    refresh:function(){
        this.updateSubMenu();
        this.reloadData();
    },
    getCurrentPermission: function(id, permissions) {
        return Lazy(permissions).find(permission => permission.id && permission.id === id);
    },
    _getQuickEditActionFunctions:function(itemId,itemName){
		const   self      = this,
			    action    = itemName,
                prId      = itemId,
                binding   = self.getDefaultBinding().sub('data'),
                currentPr = self.getCurrentPermission(prId, binding.toJS()),
                schoolId  = currentPr.requestedPermission.schoolId;
        let confirmMsg;
		switch (action){
            case 'Accept':
                if(currentPr.requestedPermission.preset === "PARENT") {
					document.location.hash = `${document.location.hash}/accept?prId=${prId}&schoolId=${schoolId}`;
				} else {
					confirmMsg = window.confirm("Are you sure you want to accept ?");
					if(confirmMsg === true){
                        // TODO Sweet Jesus! Where in the hell did that come from!
                        // Hm, this component(AdminRequest) used on manager side and on admin side. WTF?! It's AdminRequest!
                        // Yep, it's sad, but true.
                        // Ok go to subject, for manager and for admin we have different service lists, with different routes, but with same route names.
                        // For admin we have statusPermissionRequest route with url - /superadmin/users/permissions/requests/{prId}/status
                        // For manager we have statusPermissionRequest route with url - /i/schools/{schoolId}/permissions/requests/{prId}/status
                        // So, for manager schoolId is required, for admin isn't required.
						window.Server.statusPermissionRequest.put({schoolId:schoolId, prId:prId},{status:'ACCEPTED'}).then(function(){
							binding.update(function(permissions) {
								return permissions.filter(function(permission) {
									return permission.get('id') !== prId;
								});
							});
                            self.refresh();
						});
					}
				}
                break;
            case 'Decline':
                confirmMsg = window.confirm("Are you sure you want to decline ?");
                if(confirmMsg === true){
                    // TODO Ohhhh, same again
                    // Pls look up at previous comment
                    window.Server.statusPermissionRequest.put({schoolId:schoolId, prId:prId},{status:'REJECTED'}).then(function(){
                        binding.update(function(permissions) {
                            return permissions.filter(function(permission) {
                                return permission.get('id') !== prId;
                            });
                        });
                        self.refresh();
                    });
                }
                break;
            default :
                break;
        }
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            schools = binding.get('schools');
        return (
            <If condition={!!schools}>
                <div className="eTable_view">
                    <Table title="Permissions" binding={binding}
                           addQuickActions={true}
                           getDataPromise={self._getDataPromise}
                           quickEditActionsFactory={self._getQuickEditActionFunctions}
                           quickEditActions={self.groupActionList}
                           isPaginated={true}
                           getTotalCountPromise={self._getTotalCountPromise}
                           filter={self.filter}
                    >
                        <TableField dataField="requestedPermission" filterType="none" parseFunction={self.getSchoolName} >School</TableField>
                        <TableField dataField="requestedPermission" filterType="none" parseFunction={self.getSchoolEmblem}>Emblem</TableField>
                        <TableField dataField="requester" dataFieldKey="email">Email</TableField>
                        <TableField dataField="requestedPermission" dataFieldKey="preset" >Permission</TableField>
                        <TableField dataField="requestedPermission" dataFieldKey="comment" width="240px" >Details</TableField>
                    </Table>
                </div>
            </If>
        );
    }
});

module.exports = AdminRequest;