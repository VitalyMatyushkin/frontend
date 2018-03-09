/**
 * Created by bridark on 12/06/15.
 */

//      Данный компонент общий, поэтому должен уметь работать как для суперадмина, так и для менеджера.
// Есть две проблемы которые необходимо решить:
//            1. разные сервисы у суперадмина и менеджеров,
//            2. разные наборы параметров для этих сервисов.
//      Первая проблема решается с помощью props и способностью роутера эти props передавать. Посредством пропс
// мы передаем сервис, который нужно использовать. (см. метод - getDefaultProps)
//      Вторая проблема решается формированием избыточного набора параметров, т.е. включающего параметры необходимые в
// обоих случаях. Сервис сам отберет только нужные ему значения. (self.params = {schoolId:schoolId, userId:userId};)

const   EditUser            = require('./user_edit'),
        EditPermission      = require('./permission_edit'),
        React               = require('react'),
        Popup               = require('module/ui/popup'),
        Immutable           = require('immutable'),
        Morearty            = require('morearty'),
        UserViewSummary     = require('module/shared_pages/users/user_view_summary'),
	    AddRole		        = require('./add_role'),
        {If}                = require('module/ui/if/if'),
		propz				= require('propz'),
	    {SVG} 	            = require('module/ui/svg'),
	    {DateHelper} 	    = require('module/helpers/date_helper'),
	    loaderUtils	        = require('module/helpers/loader_utils');

const UserDetail= React.createClass({
    mixins: [Morearty.Mixin],
      getDefaultProps: function() {
          return {
              isEditable:true
          };
      },
    componentWillMount: function() {
        const   binding         = this.getDefaultBinding(),
                globalBinding   = this.getMoreartyContext().getBinding(),
                userId          = globalBinding.get('routing.parameters.id'),
                schoolId        = globalBinding.get('userRules.activeSchoolId');

        //Parameters services for the super-administrator and managers
        this.params = {schoolId, userId};
        this.isSuperAdmin = loaderUtils.parseDomainName(document.location.hostname).model === 'admin' ? true : false;
        binding.set('popup',false);
        binding.set('editPermission',false);
        binding.set('addRole',false);
        this.request = window.Server.user.get(this.params).then( user => {
            user.permissions.sort(this.sortPermission);
            binding.set('userWithPermissionDetail',Immutable.fromJS(user));
            return user;
        });
        this.addBindingListener(binding, 'popup', this.userReload);
        this.addBindingListener(binding, 'editPermission', this.userReload);
        this.addBindingListener(binding, 'addRole', this.userReload);
    },
    userReload: function () {
        const binding = this.getDefaultBinding();
        if(binding.get('editPermission')===false || binding.get('addRole')===false){
            window.Server.user.get(this.params)
                .then((user) => {
                    user.permissions.sort(this.sortPermission);
                    binding.set('userWithPermissionDetail',Immutable.fromJS(user));
                    return user;
                });
        }
    },
    sortPermission: function (a, b) {
        if (a.schoolId > b.schoolId) {
            return 1;
        }
        if (a.schoolId < b.schoolId) {
            return -1;
        }
        return 0;
    },
    componentWillUnmount: function() {
        this.request && this.request.cancel();
    },
    onEditClick:function(evt){
        const   binding = this.getDefaultBinding();

        binding.set('popup',true);
        evt.stopPropagation();
    },
	onAddRoleClick:function(evt){
		const   binding = this.getDefaultBinding();

		binding.set('addRole',true);
		evt.stopPropagation();
	},
    onEditPermissionClick:function(permissionId){
        const   binding = this.getDefaultBinding();

        binding.set('editPermissionId', permissionId);
        binding.set('editPermission', true);
    },
    revokePermission: function (permissionId) {
        const   binding = this.getDefaultBinding(),
                userId = binding.toJS('userWithPermissionDetail.id'),
                permissions = binding.sub('userWithPermissionDetail.permissions'),
                newPermissions 	= permissions.toJS().filter(p => p.id !== permissionId);

        window.confirmAlert(
            "Are you sure you want to revoke this permission?",
            "Ok",
            "Cancel",
            () => {
                window.Server.userPermission.delete({userId, permissionId})
                    .then(() => {
                        permissions.set(newPermissions);
                    });
            },
            () => {}
        );
    },
    _getRelatedSchool:function(data){
        if(data !== undefined){
            return data.map( (role, i) => {
				const   imageSrc = propz.get(role, ['school', 'pic'], 'http://placehold.it/75x75'),
                        today = new Date(),
                        activated = role.activatedAt ? new Date(role.activatedAt) : null,
                        deactivated = role.deactivatedAt ? new Date(role.deactivatedAt) : null,
                        statusRole = (role.status === 'ACTIVE' && activated && deactivated && (today < activated || today > deactivated)) ? `${role.status}/Outdated` : role.status,
                        dateInterval = (role.status === 'ACTIVE' && activated && deactivated)
                            ? `${DateHelper.getDateShortTimeString(activated)} 
                            - ${DateHelper.getDateShortTimeString(deactivated)}` : '';
				return(
                    <div key={i} className="eDataList_listItem">
                        <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={imageSrc}/></span></div>
                        <div className="eDataList_listItemCell">{role.school ? role.school.name: 'n/a'}</div>
                        <div className="eDataList_listItemCell">{role.student ? role.student.firstName+" "+role.student.lastName : ''}</div>
                        <div className="eDataList_listItemCell">{role.preset}</div>
                        <div className="eDataList_listItemCell">
                            <div>{statusRole}</div>
                            <div className="bItemDateInterval">{dateInterval}</div>
                        </div>
	                    <div className="eDataList_listItemCell">
                            <span key={i + "edit"} id="edit_row"
                                  onClick={this.onEditPermissionClick.bind(null, role.id)}
                                  className="bLinkLike bTooltip" data-description="Edit">
                                <SVG icon="icon_edit"/>
                            </span>
		                    <span key={i + "remove"} id="remove_row"
		                          onClick={this.revokePermission.bind(null, role.id)}
		                          className="bLinkLike delete_btn bTooltip" data-description="Delete">
                                <SVG icon="icon_delete"/>
			                </span>
	                    </div>
                    </div>
                )
            });
        }
    },
    _closePopup:function(){
        const binding = this.getDefaultBinding();
        binding.set('popup',false);
    },
    _closeEditPermissionPopup:function(){
        const binding = this.getDefaultBinding();
        binding.set('editPermission',false);
    },
	_closeAddRolePopup:function(){
		const binding = this.getDefaultBinding();
		binding.set('addRole',false);
	},
    render: function() {
        let selectedUserData, listItems;
        const binding = this.getDefaultBinding();
        if(typeof binding.toJS('userWithPermissionDetail')!== 'undefined'){
            selectedUserData = binding.toJS('userWithPermissionDetail');
            listItems = this._getRelatedSchool(binding.toJS('userWithPermissionDetail.permissions'));
        }
        return (
            <div>
                <div className = "bAdminView">
                    <UserViewSummary selectedUserData={selectedUserData} />
                    <If condition={this.props.isEditable}>
                        <div className="eSchoolMaster_buttons">
                            <h3>Actions</h3>
                            <div>
                                <a onClick={this.onEditClick} className="bButton">Edit...</a>
                                <a onClick={this.onAddRoleClick} className="bButton">Add role</a>
                            </div>
                        </div>
                    </If>
                </div>
                <div style={{padding:10+'px'}}>
                    <div className="eSchoolMaster_wrap">
                        <h1 className="eSchoolMaster_title">Related Schools</h1>
                        <div className="eStrip"></div>
                    </div>
                    </div>
                    <div className="bDataList mCentred">
                        <div className="eDataList_list mTable">
                            <div className="eDataList_listItem mHead">
                                <div className="eDataList_listItemCell" style={{width:15+'%'}}>School Crest</div>
                                <div className="eDataList_listItemCell" style={{width:22+'%'}}>School</div>
                                <div className="eDataList_listItemCell" style={{width:23+'%'}}>Child</div>
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>Role</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>Status</div>
								<div className="eDataList_listItemCell" style={{width: 10 + '%'}}>Actions</div>
                            </div>
                            {listItems}
                        </div>
                    </div>
                <Popup
                    binding         = {binding}
                    stateProperty   = {'popup'}
                    onRequestClose  = {this._closePopup}
                    otherClass      = "bPopupEdit"
                >
                    <EditUser
                        binding     = {binding}
                        onCancel    = {this._closePopup}
                    />
                </Popup>
                <Popup
                    binding         = {binding}
                    stateProperty   = {'editPermission'}
                    onRequestClose  = {this._closeEditPermissionPopup}
                    otherClass      = "bPopupPermission"
                >
                    <EditPermission
                        binding      = {binding}
                        isSuperAdmin = {this.isSuperAdmin}
                        onCancel     = {this._closeEditPermissionPopup}
                    />
                </Popup>
                <Popup
                    binding         = {binding}
                    stateProperty   = {'addRole'}
                    onRequestClose  = {this._closeAddRolePopup}
                    otherClass      = "bPopupPermission"
                >
                    <AddRole
                        binding     = {binding}
                        onCancel    = {this._closeAddRolePopup}
                    />
                </Popup>
            </div>
        )
    }
});


module.exports = UserDetail;