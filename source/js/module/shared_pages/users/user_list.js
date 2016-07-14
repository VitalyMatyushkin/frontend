/**
 * Created by Anatoly on 24.04.2016.
 */

const   Table 			= require('module/ui/list/table'),
        TableField 		= require('module/ui/list/table_field'),
        UserModel 		= require('module/data/UserModel'),
        DateTimeMixin 	= require('module/mixins/datetime'),
        ListPageMixin 	= require('module/mixins/list_page_mixin'),
        React 			= require('react'),
		Morearty        = require('morearty'),
		AdminDropList   = require('module/ui/admin_dropList/admin_dropList'),
        Popup 			= require('module/ui/popup');

const UsersList = React.createClass({
    mixins:[Morearty.Mixin, DateTimeMixin, ListPageMixin],
    propTypes:{
        grantRole:React.PropTypes.func,
		permissionServiceName:React.PropTypes.string,
		blockService:React.PropTypes.object
	},
    serviceName:'users',
    serviceCount:'usersCount',
    filters:{
        include: {
            relation:"permissions",
            scope: { include: {"relation": "school"}}
        }
    },
    groupActionList:['View','Add Role','Revoke All Roles'],
    setPageTitle:"Users & Permissions",
	componentDidMount:function(){
		const self = this;
		if(self.props.blockService)
			self.groupActionList = ['View','Block','Unblock','Add Role','Revoke All Roles']
	},
    _getItemViewFunction:function(model){
        if(model.length === 1){
            window.location.hash = 'user/view?id='+model[0];
        }else{
            alert("You can only perform this action on one Item");
        }
    },
    _getQuickEditActionsFactory:function(itemId,action){
        const 	self = this,
				binding = self.getDefaultBinding(),
				data = binding.sub('data'),
				idAutoComplete = [],
				ationKey = action.key ? action.key : action;
        const user = data.get().find(function(item){
            return item.id === itemId;
        });
        idAutoComplete.push(user.id);
        switch (ationKey){
            case 'Add Role':
				binding.atomically()
					.set('groupIds',idAutoComplete)
                	.set('popup',true)
					.commit();
                break;
            case 'Revoke All Roles':
                self._revokeAllRoles(idAutoComplete);
                break;
            case 'Unblock':
                self._accessRestriction(idAutoComplete,false);
                break;
            case 'Block':
                self._accessRestriction(idAutoComplete,true);
                break;
			case 'View':
				self._getItemViewFunction(idAutoComplete);
				break;
			case 'revoke':
				self._revokeRole(idAutoComplete, action);
				break;
            default :
                break;
        }
    },
    _revokeAllRoles:function(ids){
		const   self            = this,
				rootBinding 	= self.getMoreartyContext().getBinding(),
				schoolId  		= rootBinding.get('userRules.activeSchoolId'),
				permission 		= window.Server[self.props.permissionServiceName],
				permissionList 	= window.Server[`${self.props.permissionServiceName}s`],
				confirmAction 	= window.confirm("Are you sure you want revoke all roles?");

        if(ids && ids.length > 0 ){
            if(confirmAction){
                ids.forEach(function(userId){
					const params = {userId:userId, schoolId:schoolId};

					permissionList.get(params)
                        .then(function(data){
                            data.forEach(function(p){
								if(p.preset !== 'STUDENT'){
									params.permissionId = p.id;
									permission.delete(params).then(_ => {
										self.reloadData();
									});
								}
                            });
                        });
                });
            }
        }
    },
	_revokeRole:function(ids, action){
		const   self            = this,
				rootBinding 	= self.getMoreartyContext().getBinding(),
				schoolId  		= rootBinding.get('userRules.activeSchoolId'),
				permission 		= window.Server[self.props.permissionServiceName];

		if(ids && ids.length > 0 ){
			if(window.confirm(`Are you sure you want ${action.text}?`)){
				ids.forEach(function(userId){
					const params = {userId:userId, schoolId:schoolId, permissionId:action.id};

					permission.delete(params).then(_ => {
						self.reloadData();
					});
				});
			}
		}
	},
    _accessRestriction:function(ids,block){
        const self = this,
			blockStr = block ? 'block': 'unblock';

        if(ids !== undefined && ids.length >=1){
            if(confirm(`Are you sure you want ${blockStr} user?`)){
                ids.forEach(function(id){
					self.props.blockService.post(id,{blocked: block }).then(function(){
                        self.reloadData();
                    });
                });
            }
        }else{
            alert('Please select at least 1 row');
        }
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
        self.reloadData();
    },
	getActions:function(item){
		var self 			= this,
			binding 		= self.getDefaultBinding(),
			rootBinding 	= self.getMoreartyContext().getBinding(),
			activeSchoolId 	= rootBinding.get('userRules.activeSchoolId'),
			actionList 		= [];

		self.groupActionList.forEach(action =>{
			actionList.push(action);
		});

		item.permissions.filter(p=> p.preset != 'STUDENT').forEach(p => {
			let action = 'Revoke the role ';
			if(p.preset === 'PARENT'){
				action += `of ${p.student.firstName} parent`;
			}
			else{
				action += p.preset;
			}

			if(!activeSchoolId){
				action +=' for ' + p.school.name;
			}

			actionList.push({
				text: action,
				key: 'revoke',
				id: p.id
			});
		});
		return (
			<AdminDropList key={item.id}
						   binding={binding.sub('dropList'+item.id)}
						   itemId={item.id}
						   listItems={actionList}
						   listItemFunction={self._getQuickEditActionsFactory}/>
		);

	},
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            GrantRole = self.props.grantRole;
        return (
            <div className="eTable_view">
                <Table title="Permissions" binding={binding} hideActions={true}
					   isPaginated={true} filter={self.filter} getDataPromise={self.getDataPromise}
                       getTotalCountPromise={self.getTotalCountPromise} dataModel={UserModel}>
                    <TableField dataField="firstName" >Name</TableField>
                    <TableField dataField="lastName" >Surname</TableField>
                    <TableField dataField="email" >Email</TableField>
                    <TableField dataField="verified" filterType="none" >Status</TableField>
                    <TableField dataField="school" filterType="none" >School</TableField>
                    <TableField dataField="roles" filterType="none" >Role</TableField>
					<TableField dataField="blocked" filterType="none" >Access</TableField>
					<TableField dataField="" filterType="none" parseFunction={self.getActions} >Actions</TableField>
                </Table>
                <Popup binding={binding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={binding.sub('grantRole')} userIdsBinding={binding.sub('groupIds')}
                               onSuccess={self._closePopup} />
                </Popup>
            </div>
        )
    }
});
module.exports = UsersList;