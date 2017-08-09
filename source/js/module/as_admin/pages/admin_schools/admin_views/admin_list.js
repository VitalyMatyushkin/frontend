/**
 * Created by bridark on 09/06/15.
 */
const   Table           = require('module/ui/list/table'),
        TableField      = require('module/ui/list/table_field'),
        DateTimeMixin   = require('module/mixins/datetime'),
        ListPageMixin   = require('module/mixins/list_page_mixin'),
        Morearty        = require('morearty'),
        React           = require('react');

const SchoolListPage = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin,DateTimeMixin],
    serviceName:'schools',
	serviceCount:'schoolsCount',
    getSchoolLogo:function(logo){
        if(logo){
            return (
                <span className="eChallenge_rivalPic">
                    <img src={logo}/>
                </span>
            )
        }
    },
    getSchoolStatus:function(){

    },
    _getAdminSchoolEditFunction:function(data){
        document.location.hash = 'schools/admin_views/edit?id=' + data.id;
    },
    _getItemRemoveFunction:function(model){
        var self = this,
            binding = self.getDefaultBinding();

        window.confirmAlert(
            "Do you really want to remove this item?",
            "Ok",
            "Cancel",
            () => {
                window.Server.school.delete(model.id).then(function(){
                        binding.update(function(result) {
                            return result.filter(function(res) {
                                return res.get('id') !== model.id;
                            });
                        });
                        self.reloadData();
                    }
                );
            },
            () => {}
        );
    },
    _getSelectItemFunction:function(model){
        document.location.hash = `school_sandbox/${model.id}/forms`;
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="eTable_view">
                <Table title="Schools" binding={binding} isPaginated={true} onItemRemove={self._getItemRemoveFunction}
                       getDataPromise={self.getDataPromise}
					   getTotalCountPromise={self.getTotalCountPromise}
                       onItemEdit={self._getAdminSchoolEditFunction} 
                       onItemSelect={self._getSelectItemFunction}>
                    <TableField dataField="pic" width="1%" filterType="none" parseFunction={self.getSchoolLogo}>Logo</TableField>
                    <TableField dataField="name" width="14%">School</TableField>
                    <TableField dataField="phone" filterType="none" width="10%">Telephone</TableField>
                    <TableField dataField="address" width="20%">Address</TableField>
                    <TableField dataField="domain" width="14%">Domain</TableField>
                    <TableField dataField="status" width="14%">Status</TableField>
                </Table>
            </div>
        )
    }
});


module.exports = SchoolListPage;