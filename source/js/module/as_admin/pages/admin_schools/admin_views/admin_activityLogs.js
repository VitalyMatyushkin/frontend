/**
 * Created by bridark on 15/07/15.
 */
var ActivityLogPage,
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    React = require('react'),
    ReactDOM = require('reactDom'),
    ListPageMixin = require('module/mixins/list_page_mixin');
ActivityLogPage = React.createClass({
    mixins:[Morearty.Mixin,ListPageMixin, DateTimeMixin],
    serviceName:'activityLogs',
    filters: {order:'meta.created DESC'},
    serviceCount:'logCount',
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
            <Table  title="Activity Logs" binding={binding} hideActions={true}
                    isPaginated={true} filter={self.filter} getDataPromise={self.getDataPromise}
                    getTotalCountPromise={self.getTotalCountPromise} pageLimit={40} >
                <TableField dataField="meta" filterType="none" parseFunction={self.getDate}>Date</TableField>
                <TableField dataField="hostname" >Hostname</TableField>
                <TableField dataField="message">Message</TableField>
                <TableField dataField="scope" >Scope</TableField>
                <TableField dataField="level">Level</TableField>
            </Table>
        )
    }
});
module.exports = ActivityLogPage;