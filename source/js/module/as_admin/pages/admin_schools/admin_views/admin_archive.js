/**
 * Created by bridark on 24/06/15.
 */
var AdminArchive,
    List = require('module/ui/list/list'),
    ListField = require('module/ui/list/list_field'),
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin');
AdminArchive = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin,ListPageMixin],
    serviceName:'Permissions',
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
    getRequestStudentName:function(student){
        if(student !== undefined){
            return student.firstName+' '+student.lastName;
        }else{
            return 'n/a';
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
                <Table title="Permissions" binding={binding}  onFilterChange={self.updateData} hideActions={true}>
                    <TableField dataField="meta" filterType="none" parseFunction={self.getRequestDate} width="17%">Date</TableField>
                    <TableField dataField="preset" filterType="none" width="10%">Request</TableField>
                    <TableField dataField="principal" filterType="none" parseFunction={self.getRequestPrincipalName} width="20%">From</TableField>
                    <TableField dataField="principal" filterType="none" parseFunction={self.getRequestEmail} width="15%">Email</TableField>
                    <TableField dataField="school" filterType="none"parseFunction={self.getRequestSchoolName} width="35%">School</TableField>
                    <TableField dataField="student" filterType="none" parseFunction={self.getRequestStudentName} width="30%">Student</TableField>
                    <TableField dataField="accepted" filterType="none" parseFunction={self.getRequestResponse} width="14%">Response</TableField>
                </Table>
            </div>
        );
    }
});
module.exports = AdminArchive;