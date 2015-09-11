/**
 * Created by bridark on 09/06/15.
 */
var List = require('module/ui/list/list'),
    ListField = require('module/ui/list/list_field'),
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    SVG = require('module/ui/svg'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
    SchoolListPage,
    theList;

SchoolListPage = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin,DateTimeMixin],
    serviceName:'schools',
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
    _getItemRemoveFunction:function(model){
        var self = this,
            binding = self.getDefaultBinding(),
            confirm = window.confirm("Do you really want to remove this item?");
        if(confirm === true){
            window.Server.school.delete({id:model.id}).then(function(){
                    binding.update(function(result) {
                        return result.filter(function(res) {
                            return res.get('id') !== model.id;
                        });
                    });
                }
            );
        }
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="eTable_view">
                <Table title="Schools" binding={binding} onItemRemove={self._getItemRemoveFunction} onFilterChange={self.updateData}>
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