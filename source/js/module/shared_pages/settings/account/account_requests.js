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
        GrantRole       = require('module/ui/grant_role/grant_role'),
        Immutable 	    = require('immutable');


const AccountRequests = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin],
    serviceName:'profileRequests',
    groupActionList:['Accept','Decline'],
    filters:{include:['school']},
    addButton:true,
    componentWillMount:function(){
        const self = this;

        self.getSchools();
        self.addButton = <span onClick={self.handleAddNewButtonClick} className="addButton addNewForm"/>;

    },
    getSchools:function(){
        const 	self 	= this,
            binding = self.getDefaultBinding();

        window.Server.publicSchools.get().then(schools => {
            binding.set('schools', schools);
        });
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
    getStatus:function(status){
        return <span className={'request-'+status.toLowerCase()}>{status}</span>;
    },
    getActions:function(request){
        return 'not implemented';
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
    handleAddNewButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',true);
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
    },
    _onSuccess:function(){
        this._closePopup();
        this.reloadData();
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            schools = binding.get('schools');

        return (
            <If condition={!!schools}>
                <div className="eTable_view">
                    <Table title="My Requests" binding={binding} getDataPromise={self.getDataPromise}
                           filter={self.filter} hideActions={true} >
                        <TableField dataField="requestedPermission" filterType="none" parseFunction={self.getSchoolName} >School</TableField>
                        <TableField dataField="requestedPermission" dataFieldKey="preset" >Permission</TableField>
                        <TableField dataField="requestedPermission" dataFieldKey="comment" >Details</TableField>
                        <TableField dataField="date" filterType="none" >Request Date</TableField>
                        <TableField dataField="status" parseFunction={self.getStatus} >Request Status</TableField>
                        <TableField dataField="requestedPermission" filterType="none" parseFunction={self.getActions} >Actions</TableField>
                    </Table>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                        <GrantRole binding={binding.sub('grantRole')} userIdsBinding={rootBinding.sub('userData.authorizationInfo.userId')}
                                   onSuccess={self._onSuccess}/>
                    </Popup>
                </div>
            </If>
        );
    }





});

module.exports = AccountRequests;