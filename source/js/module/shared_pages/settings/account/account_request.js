/**
 * Created by Anatoly on 19.04.2016.
 */

const   Table           = require('module/ui/list/table'),
        TableField      = require('module/ui/list/table_field'),
        React           = require('react'),
        If              = require('module/ui/if/if'),
        Lazy            = require('lazyjs'),
        ListPageMixin   = require('module/as_manager/pages/school_admin/list_page_mixin'),
        Popup           = require('module/ui/popup'),
        GrantRole       = require('module/ui/grant_role/grant_role');

const AccountRequests = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin],
    serviceName:'profileRequests',
    groupActionList:['Accept','Decline'],
    filters:{include:['school']},

    componentWillMount:function(){
        const self = this;

        self.getSchools();
    },
    getSchools:function(){
        const 	self 	= this,
            binding = self.getDefaultBinding();

        window.Server.publicSchools.get().then(schools => {
            binding.set('schools', schools);
        });
    },
    getSchoolEmblem:function(permission){
        var self = this,
            binding = self.getDefaultBinding(),
            schools = binding.get('schools'),
            school = schools && permission ? schools.find(s => s.id === permission.schoolId) : null;

        if(school && school.pic){
            return <span className="eChallenge_rivalPic"><img src={window.Server.images.getResizedToBoxUrl(school.pic, 60, 60)}/></span>;
        }
    },
    getSchoolName:function(permission){
        var self = this,
            binding = self.getDefaultBinding(),
            schools = binding.get('schools'),
            school = schools && permission ? schools.find(s => s.id === permission.schoolId) : null;

        if(school){
            return school.name;
        }
    },
    _getQuickEditActionFunctions:function(itemId,itemName){
        const   self      = this,
            action    = itemName,
            prId        = itemId,
            binding   = self.getDefaultBinding().sub('data'),
            currentPr = self.getCurrentPermission(prId, binding.toJS()),
            schoolId  = currentPr.requestedPermission.schoolId;
        let confirmMsg;
        switch (action){
            case 'Accept':
                break;
            case 'Decline':
                break;
            default :
                break;
        }
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            schools = binding.get('schools');

        return (
            <If condition={!!schools}>
                <div className="eTable_view">
                    <Table title="Permissions" binding={binding} addQuickActions={true}
                           quickEditActionsFactory={self._getQuickEditActionFunctions}
                           quickEditActions={self.groupActionList} getDataPromise={self.getDataPromise}
                           filter={self.filter} >
                        <TableField dataField="requestedPermission" filterType="none" parseFunction={self.getSchoolName} >School</TableField>
                        <TableField dataField="requestedPermission" filterType="none" parseFunction={self.getSchoolEmblem}>Emblem</TableField>
                        <TableField dataField="principalInfo" dataFieldKey="email">Email</TableField>
                        <TableField dataField="requestedPermission" dataFieldKey="preset" >Permission</TableField>
                        <TableField dataField="requestedPermission" dataFieldKey="comment" >Details</TableField>
                    </Table>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                        <GrantRole binding={binding} userIdsBinding={rootBinding.sub('userData.authorizationInfo.userId')}
                                   onSuccess={self._onSuccess}/>
                    </Popup>
                </div>
            </If>
        );
    }





});

module.exports = AccountRequests;