/**
 * Created by bridark on 08/07/15.
 */
const   React       = require('react'),
        Morearty    = require('morearty'),
        Immutable   = require('immutable');

const AccountRoles = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        const 	self 	= this,
				binding = self.getDefaultBinding();

        window.Server.profilePermissions.get().then(function(userPermissions){
                binding.set('userAccountRoles',Immutable.fromJS(userPermissions));
            });
    },
    _renderUserAccountRoleList:function(data){
		const self = this;

		if(data !== undefined){
            return data.map(function(dt){
                return(
                    <div key={dt.id} className="eDataList_listItem">
                        <div className="eDataList_listItemCell">{dt.school !== undefined ?dt.school.name : ''}</div>
                        <div className="eDataList_listItemCell">{dt.preset}</div>
                        <div className="eDataList_listItemCell">{dt.comment !== undefined ? dt.comment:''}</div>
						<div className="eDataList_listItemCell">{dt.preset !== 'STUDENT' ? <a onClick={self._revokeRole.bind(self, dt)}>Revoke</a> : null}</div>
                    </div>
                )
            });
        }
    },
	_revokeRole:function(permission){
		const self = this,
			binding = self.getDefaultBinding(),
			data = binding.toJS('userAccountRoles');

		if(window.confirm(`Are you sure you want revoke role ${permission.preset}?`)){
			window.Server.profilePermission.delete(permission.id).then(_ => {
				binding.set('userAccountRoles', data.filter(p => p.id !== permission.id));
			});
		}
	},
    render:function(){
        const self = this,
            binding = self.getDefaultBinding(),
			data = binding.toJS('userAccountRoles'),
            accountRoles = data ? self._renderUserAccountRoleList(data) : null;

        return (
            <div>
                <div className="bDataList">
                    <div className="eDataList_list mTable">
                        <div className="eDataList_listItem mHead">
                            <div className="eDataList_listItemCell">School</div>
                            <div className="eDataList_listItemCell">Role</div>
                            <div className="eDataList_listItemCell">Comments</div>
							<div className="eDataList_listItemCell">Actions</div>
						</div>
                        {accountRoles}
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = AccountRoles;