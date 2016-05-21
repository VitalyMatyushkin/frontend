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
    filters:{include:['principal','school'],where:{status:{$neq:'NEW'}},order:'createdAt DESC'},
    setPageTitle:"Requests archive",
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
	getSchoolName:function(permission){
		const self = this,
			binding = self.getDefaultBinding(),
			schools = binding.get('schools'),
			school = schools && permission ? schools.find(s => s.id === permission.schoolId) : null;

		if(school){
			return school.name;
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
                    <TableField dataField="createdAt" filterType="sorting" parseFunction={self.getDateFromIso} >Date</TableField>
                    <TableField dataField="requestedPermission" dataFieldKey="preset" >Request</TableField>
                    <TableField dataField="requester" dataFieldKey="firstName" >First Name</TableField>
                    <TableField dataField="requester" dataFieldKey="lastName" >Last Name</TableField>
                    <TableField dataField="requester" dataFieldKey="email" >Email</TableField>
                    <TableField dataField="requestedPermission" filterType="none" parseFunction={self.getSchoolName}  >School</TableField>
                    <TableField dataField="status"  >Response</TableField>
                </Table>
            </div>
        );
    }
});
module.exports = AdminArchive;