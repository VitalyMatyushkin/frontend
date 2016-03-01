const   Table     = require('module/ui/list/table'),
    TableField    = require('module/ui/list/table_field'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
    React         = require('react');

const TeamsListPage = React.createClass({
    mixins: [Morearty.Mixin, ListPageMixin],
    serviceName: 'teams',
    sandbox:true,
    _getItemRemoveFunction: function(data){

    },
    _getDataPromise: function() {
        const  self = this;

        return window.Server.teams.get({
            filter: {
                where: {
                    schoolId: self.activeSchoolId,
                    tempTeam: false
                }
            }
        });
    },
    _getAges: function(data) {
        let result = '';

        if(data !== undefined) {
            result = data.map(elem => {
               return `Y${elem}`;
            }).join(";");
        }

        return result;
    },
    getTableView: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <Table title="Teams"
                   binding={binding}
                   onItemEdit={self._getEditFunction()}
                   getDataPromise={self._getDataPromise}
                   onItemRemove={self._getItemRemoveFunction}
            >
                <TableField dataField="name"
                            filterType="none">Team Name</TableField>

                <TableField dataField="description"
                            filterType="none">Description</TableField>

                <TableField dataField="gender"
                            filterType="none">Gender</TableField>

                <TableField dataField="ages"
                            filterType="none"
                            parseFunction={self._getAges}>Ages</TableField>
            </Table>
        );
    }
});

module.exports = TeamsListPage;