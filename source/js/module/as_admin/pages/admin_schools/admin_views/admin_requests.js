/**
 * Created by bridark on 24/06/15.
 */
const   Table           = require('module/ui/list/table'),
        TableField      = require('module/ui/list/table_field'),
        DateTimeMixin   = require('module/mixins/datetime'),
        React           = require('react'),
        Lazy            = require('lazyjs'),
        ListPageMixin   = require('module/as_manager/pages/school_admin/list_page_mixin');

const AdminRequest = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin,DateTimeMixin],
    getDefaultProps: function() {
        return {
            serviceName:'Permissions',
            serviceCount:'PermissionCount'
        };
    },
    groupActionList:['Accept','Decline'],
    filters:{include:['principal','school'],where:{and:[{accepted:{neq:true}},{accepted:{neq:false}}]}},
    componentWillMount:function(){
        const self = this;

        self.updateSubMenu();
    },
    getSchoolEmblem:function(school){
        if(school !== undefined){
            return <span className="eChallenge_rivalPic"><img src={window.Server.images.getResizedToBoxUrl(school.pic, 60, 60)}/></span>;
        }
    },
	getCurrentPermission: function(id, permissions) {
        return Lazy(permissions).find(permission => permission.id && permission.id === id);
	},
    updateSubMenu:function(){
        const   self                = this,
            globalBinding       = self.getMoreartyContext().getBinding();
        globalBinding.set('submenuNeedsUpdate', !globalBinding.get('submenuNeedsUpdate'));
    },
    refresh:function(){
        this.updateSubMenu();
        this.reloadData();
    },
    _getQuickEditActionFunctions:function(itemId,itemName){
		const   self                = this,
			    action              = itemName,
                id                  = itemId,
                binding             = self.getDefaultBinding().sub('data'),
                currentPermission   = self.getCurrentPermission(id, binding.toJS());
        let confirmMsg;
		switch (action){
            case 'Accept':
                if(currentPermission.preset === "parent") {
					document.location.hash = document.location.hash + '/accept?id=' + currentPermission.id;
				} else {
					confirmMsg = window.confirm("Are you sure you want to accept ?");
					if(confirmMsg === true){
						window.Server.setPermissions.post({id:id},{accepted:true}).then(function(){
							binding.update(function(permissions) {
								return permissions.filter(function(permission) {
									return permission.get('id') !== id;
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
                    window.Server.setPermissions.post({id:id},{accepted:false}).then(function(){
                        binding.update(function(permissions) {
                            return permissions.filter(function(permission) {
                                return permission.get('id') !== id;
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
            binding = self.getDefaultBinding();
        return (
            <div className="eTable_view">
                <Table title="Permissions" binding={binding} addQuickActions={true}
                       quickEditActionsFactory={self._getQuickEditActionFunctions}
                       quickEditActions={self.groupActionList} isPaginated={true} getDataPromise={self.getDataPromise}
                       getTotalCountPromise={self.getTotalCountPromise} filter={self.filter} >
                    <TableField dataField="school"dataFieldKey="name" filterType="none" >School</TableField>
                    <TableField dataField="school" filterType="none" parseFunction={self.getSchoolEmblem}>Emblem</TableField>
                    <TableField dataField="principalInfo" dataFieldKey="email">Email</TableField>
                    <TableField dataField="preset" >Permission</TableField>
                    <TableField dataField="comment" >Details</TableField>
                </Table>
            </div>
        );
    }
});
module.exports = AdminRequest;