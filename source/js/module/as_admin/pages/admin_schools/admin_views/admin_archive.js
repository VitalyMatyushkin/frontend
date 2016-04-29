/**
 * Created by bridark on 24/06/15.
 */
var AdminArchive,
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    React = require('react'),
    ListPageMixin = require('module/mixins/list_page_mixin');
AdminArchive = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin,ListPageMixin],
    serviceName:'permissionRequests',
    serviceCount:'permissionRequestsCount',
    filters:{include:['principal','school'],where:{status:{neq:'NEW'}},order:'meta.created DESC'},
    setPageTitle:"Requests archive",
    componentWillMount:function(){
        const self = this;

    },
    getRequestDate:function(meta){
        var self = this;
        return self.getDateFromIso(meta.created);
    },
    getRequestPrincipalName:function(principal){
        if(principal !==undefined){
            return principal.firstName+' '+principal.lastName;
        }
    },
    getRequestResponse:function(accepted){
        return accepted === true ? 'Accepted' :'Declined';
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="eTable_view">
                <Table title="Permissions" binding={binding}  hideActions={true}
                       isPaginated={true} getDataPromise={self.getDataPromise}
                       getTotalCountPromise={self.getTotalCountPromise} filter={self.filter}>
                    <TableField dataField="meta" dataFieldKey="created" filterType="sorting" parseFunction={self.getRequestDate} >Date</TableField>
                    <TableField dataField="preset" >Request</TableField>
                    <TableField dataField="principalInfo" dataFieldKey="firstName" >First Name</TableField>
                    <TableField dataField="principalInfo" dataFieldKey="lastName" >Last Name</TableField>
                    <TableField dataField="principalInfo" dataFieldKey="Email" >Email</TableField>
                    <TableField dataField="school" dataFieldKey="name" filterType="none"  >School</TableField>
                    <TableField dataField="accepted" filterType="sorting" parseFunction={self.getRequestResponse} >Response</TableField>
                </Table>
            </div>
        );
    }
});
module.exports = AdminArchive;