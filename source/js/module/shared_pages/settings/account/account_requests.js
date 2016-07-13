/**
 * Created by Anatoly on 19.04.2016.
 */

const   Table           = require('module/ui/list/table'),
        TableField      = require('module/ui/list/table_field'),
        React           = require('react'),
        If              = require('module/ui/if/if'),
        Lazy            = require('lazy.js'),
        Date            = require('module/helpers/date_helper'),
        ListPageMixin   = require('module/mixins/list_page_mixin'),
        Popup           = require('module/ui/popup'),
        AddRequest      = require('module/shared_pages/settings/account/add_request'),
        Immutable 	    = require('immutable');


const AccountRequests = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin],
    serviceName:'profileRequests',
    filters:{include:['school']},
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
        const self = this,
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
        const self = this;

        if(request.status === 'NEW'){
            return (
                <span title="Cancel Request" className="requestActions" onClick={self._cancelRequest.bind(null,request)}>Cancel</span>
            );
        }
    },
    _withdrawRequest:function(request){
        const   self = this,
                conf = confirm(`Are you sure you want to withdraw your permission ${request.requestedPermission.preset}`);

        if(conf){
            //window.Server.profilePermission.delete(request.id).then(p => {
            //    return window.Server.profileRequest.delete(request.id).then(res => self.reloadData());
            //});
            alert('Not implemented');
        }
    },
    _cancelRequest:function(request){
        const   self = this,
                conf = confirm('Are you sure you want to cancel pending request?');

        if(conf){
                window.Server.profileRequest.delete(request.id).then(res => self.reloadData());
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
                        <TableField dataField="createdAt" filterType="none" parseFunction={Date.getDate} >Date</TableField>
                        <TableField dataField="status" parseFunction={self.getStatus} >Status</TableField>
                        <TableField dataField="" filterType="none" parseFunction={self.getActions} >Actions</TableField>
                    </Table>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                        <AddRequest binding={binding.sub('addRequest')} onSuccess={self._onSuccess}/>
                    </Popup>
                </div>
            </If>
        );
    }





});

module.exports = AccountRequests;