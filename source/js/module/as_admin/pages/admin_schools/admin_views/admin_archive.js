/**
 * Created by bridark on 24/06/15.
 */
var AdminArchive,
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    React = require('react'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin');
AdminArchive = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin,ListPageMixin],
    serviceName:'Permissions',
    serviceCount:'PermissionCount',
    filters:{include:['principal','school'],where:{or:[{accepted:true},{accepted:false}]},order:'meta.created ASC'},
    getRequestDate:function(meta){
        var self = this;
        return self.getDateFromIso(meta.created);
    },
    getRequestPrincipalName:function(principal){
        if(principal !==undefined){
            return principal.firstName+' '+principal.lastName;
        }
    },
    getRequestSchoolName:function(school){
        if(school !== undefined){
            return school.name;
        }
    },
    getRequestResponse:function(accepted){
        return accepted === true ? 'Accepted' :'Declined';
    },
    getRequestEmail:function(principal){
        if(principal !== undefined){
            return principal.email;
        }
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="eTable_view">
                <Table title="Permissions" binding={binding}  hideActions={true}
                       isPaginated={true} getDataPromise={self.getDataPromise}
                       getTotalCountPromise={self.getTotalCountPromise} filter={self.filter}>
                    <TableField dataField="meta" filterType="none" parseFunction={self.getRequestDate} width="17%">Date</TableField>
                    <TableField dataField="preset" width="10%" dataFieldKey="preset" filterType="none">Request</TableField>
                    <TableField dataField="principal" dataFieldKey="lastName" filterType="none" parseFunction={self.getRequestPrincipalName} width="20%">From</TableField>
                    <TableField dataField="principal" filterType="none" parseFunction={self.getRequestEmail} width="15%">Email</TableField>
                    <TableField dataField="school" dataFieldKey="name" filterType="none" parseFunction={self.getRequestSchoolName} width="25%">School</TableField>
                    <TableField dataField="accepted" filterType="none" parseFunction={self.getRequestResponse} width="10%">Response</TableField>
                </Table>
            </div>
        );
    }
});
module.exports = AdminArchive;