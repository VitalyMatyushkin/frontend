/**
 * Created by bridark on 15/07/15.
 */
var ActivityLogPage,
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    React = require('react'),
    ReactDOM = require('reactDom'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin');
ActivityLogPage = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin, DateTimeMixin],
    serviceName:'activityLogs',
    filters: {limit:40},
    serviceCount:'logCount',
    isPaginated: true,
    getPrincipal: function(principal) {
        return [principal.firstName, principal.lastName].join(' ') + '\r\n[' + principal.email + ']';
    },
    getDate: function(meta) {
        var self = this;
        return self.getTimeFromIso(meta.created)+'\r\n['+self.getDateFromIso(meta.created)+']';
    },
    getStatus: function(accepted) {
        var self = this,
            status = 'accepted';

        if (accepted === false) {
            status = 'declined';
        } else if (accepted === undefined) {
            status = 'waiting';
        }

        return status;
    },
    getTableView: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <Table title="Activity Logs" binding={binding} onFilterChange={self.updateData} hideActions={true}>
                <TableField dataField="meta" width="35%" filterType="none" parseFunction={self.getDate}>Date</TableField>
                <TableField dataField="method" width="10%">Method</TableField>
                <TableField dataField="responseTime" width="15%">Duration</TableField>
                <TableField dataField="statusCode" width="5%">Code</TableField>
                <TableField dataField="ip" width="20%" >IP</TableField>
                <TableField dataField="referer" width="20%" >Referrer</TableField>
                <TableField dataField="scope" width="20%" >Scope</TableField>
                <TableField dataField="limit">Limit</TableField>
            </Table>
        )
    }
});
module.exports = ActivityLogPage;