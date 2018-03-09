/**
 * Created by bridark on 08/07/15.
 */
const 	React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable'),
		{If}		= require('module/ui/if/if'),
		Loader 		= require('module/ui/loader'),
		{AllowedSports} = require('module/shared_pages/settings/allowed_sports/allowed_sports.tsx');

const AccountRoles = React.createClass({
	mixins:[Morearty.Mixin],
	componentWillMount:function(){
		const 	binding = this.getDefaultBinding();

		binding.set('sync', false);
		window.Server.profilePermissions.get({filter:{limit:40}}).then( userPermissions => {
				binding.set('userAccountRoles',Immutable.fromJS(userPermissions));
				binding.set('sync', true);
			});
	},
	renderActions: function (userData) {
		switch (userData.preset) {
			case 'STUDENT': {
				return (
					<div className="eDataList_listItemCell">
					</div>
				);
			}
			case 'COACH': {
				return (
					<div className="eDataList_listItemCell">
						<a onClick={this.viewDetails.bind(this, userData)}>View Details</a>
						<br/>
						<a onClick={this.revokeRole.bind(this, userData)}>Revoke</a>
					</div>
				);
			}
			default: {
				return (
					<div className="eDataList_listItemCell">
						<a onClick={this.revokeRole.bind(this, userData)}>Revoke</a>
					</div>
				);
			}
		}
	},
	renderUserAccountRoleList:function(data){
		if(data !== undefined){
			return data.map( userData => {
				return(
					<div key={userData.id} className="eDataList_listItem">
						<div className="eDataList_listItemCell">{userData.school !== undefined ? userData.school.name : ''}</div>
						<div className="eDataList_listItemCell">{userData.preset}</div>
						<div className="eDataList_listItemCell">{userData.comment !== undefined ? userData.comment : ''}</div>
						{this.renderActions(userData)}
					</div>
				)
			});
		}
	},
	revokeRole:function(permission){
		const 	binding 	= this.getDefaultBinding(),
				data 		= binding.toJS('userAccountRoles');

		if(window.confirm(`Are you sure you want revoke role ${permission.preset}?`)){
			window.Server.profilePermission.delete(permission.id).then( () => {
				binding.set('userAccountRoles', data.filter(p => p.id !== permission.id));
			});
		}
	},
	viewDetails: function(permission){
		window.simpleAlert(<AllowedSports permission={permission}/>);
	},
	render:function(){
		const 	binding 		= this.getDefaultBinding(),
				data 			= binding.toJS('userAccountRoles'),
				isSync			= binding.toJS('sync'),
				accountRoles 	= data ? this.renderUserAccountRoleList(data) : null,
				isUserHaveRole 	= isSync && data.length !== 0;

		if (isUserHaveRole) {
			return (
				<div>
					<div className="bDataList">
						<Loader condition={!isSync} />
						<If condition={isSync}>
							<div className="eDataList_list mTable">
								<div className="eDataList_listItem mHead">
									<div className="eDataList_listItemCell">School</div>
									<div className="eDataList_listItemCell">Role</div>
									<div className="eDataList_listItemCell">Comments</div>
									<div className="eDataList_listItemCell">Actions</div>
								</div>
								{accountRoles}
							</div>
						</If>
					</div>
				</div>
			)
		} else {
			return (
				<div className="bDataList">
					<Loader condition={!isSync} />
					<If condition={isSync}>
						<div className="eDataList_listItemText">You don't have any roles right now. Please request one via the <a href="#settings/requests">Requests</a> tab
						</div>
					</If>
				</div>
			)
		}
	
	}
});
module.exports = AccountRoles;