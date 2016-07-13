/**
 * Created by bridark on 08/07/15.
 */
const   React       = require('react'),
        ReactDOM    = require('react-dom'),
        Immutable   = require('immutable');


const AccountRoles = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self, binding, globalBinding;
        self = this;
        binding = self.getDefaultBinding();
        globalBinding = self.getMoreartyContext().getBinding();
        window.Server.profilePermissions.get({filter:{
            include:{
                relation:'school'
            }
        }}).then(function(userPermissions){
                binding.set('userAccountRoles',Immutable.fromJS(userPermissions));
            });
    },
    _renderUserAccountRoleList:function(data){
        if(data !== undefined){
            return data.map(function(dt){
                return(
                    <div key={dt.id} className="eDataList_listItem">
                        <div className="eDataList_listItemCell">{dt.school !== undefined ?dt.school.name : ''}</div>
                        <div className="eDataList_listItemCell">{dt.preset}</div>
                        <div className="eDataList_listItemCell">{dt.comment !== undefined ? dt.comment:''}</div>
                    </div>
                )
            });
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            accountRoles;
        if(binding.get('userAccountRoles') !== undefined){
            accountRoles = self._renderUserAccountRoleList(binding.get('userAccountRoles').toJS());
        }
        return (
            <div>
                <div className="bDataList">
                    <div className="eDataList_list mTable">
                        <div className="eDataList_listItem mHead">
                            <div className="eDataList_listItemCell eDataList_accountRole">School</div>
                            <div className="eDataList_listItemCell eDataList_accountRoleName">Role</div>
                            <div className="eDataList_listItemCell eDataList_accountRole">Comments</div>
                        </div>
                        {accountRoles}
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = AccountRoles;