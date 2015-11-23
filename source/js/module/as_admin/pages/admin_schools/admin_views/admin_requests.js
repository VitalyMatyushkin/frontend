/**
 * Created by bridark on 24/06/15.
 */
var AdminRequest,
    List = require('module/ui/list/list'),
    ListField = require('module/ui/list/list_field'),
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin');

AdminRequest = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin,DateTimeMixin],
    serviceName:'Permissions',
    groupActionList:['Accept','Decline'],
    filters:{include:['principal','school']},
    getSchoolName:function(school){
        if(school !== undefined ){
            return school.name;
        }
    },
    getSchoolEmblem:function(school){
        if(school !== undefined){
            return <span className="eChallenge_rivalPic"><img src={school.pic}/></span>;
        }
    },
    getPrincipalEmail:function(principal){
        if(principal !== undefined){
            return principal.email;
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
    _getQuickEditActionFunctions:function(event){
		var self = this,
			action = event.currentTarget.textContent,
            id = event.currentTarget.parentNode.dataset.userobj,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            currentPermission = self.getCurrentPermission(id, binding.toJS()),
			confirmMsg;
        event.currentTarget.parentNode.classList.remove('groupActionList_show');

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
                            globalBinding.set('submenuNeedsUpdate', !globalBinding.get('submenuNeedsUpdate'));
						});
					}
				}
                break;
            case 'Decline':
                confirmMsg = window.confirm("Are you sure you want to decline ?");
                if(confirmMsg === true){
                    window.Server.Permission.setPermissions.post({id:id},{accepted:false}).then(function(){
                        binding.update(function(permissions) {
                            return permissions.filter(function(permission) {
                                return permission.get('id') !== id;
                            });
                        });
                        globalBinding.set('submenuNeedsUpdate', !globalBinding.get('submenuNeedsUpdate'));
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
                <Table title="Permissions" binding={binding} addQuickActions={true} quickEditActionsFactory={self._getQuickEditActionFunctions} quickEditActions={self.groupActionList} onFilterChange={self.updateData}>
                    <TableField dataField="school" filterType="none" width="20%" parseFunction={self.getSchoolName}>School</TableField>
                    <TableField dataField="school" filterType="none" parseFunction={self.getSchoolEmblem}>Emblem</TableField>
                    <TableField dataField="principal" filterType="none" width="20%" parseFunction={self.getPrincipalEmail}>Email</TableField>
                    <TableField dataField="preset" filterType="none">Permission</TableField>
                    <TableField dataField="comment" filterType="none" width="20%">Details</TableField>
                </Table>
            </div>
        );
    }
});
module.exports = AdminRequest;