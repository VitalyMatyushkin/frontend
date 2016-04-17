const   Table     = require('module/ui/list/table'),
    TableField    = require('module/ui/list/table_field'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
    Sport		  = require('module/ui/icons/sport_icon'),
    React         = require('react');

const TeamsListPage = React.createClass({
    mixins: [Morearty.Mixin, ListPageMixin],
    serviceName: 'teams',
    filters: {
        include:'sport',
        where: {tempTeam: false }
    },
    _getItemRemoveFunction: function(data){

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
    _getGender: function (data) {
        var result = '';

        if (data !== undefined) {
            if (data === 'female') {
                result = 'girls'
            } else {
                result = 'boys'
            }
        }
        return result;
    },
    _getSport: function (sport) {
        const name = sport ? sport.name : '';

        return <Sport name={name} className="bIcon_invites" ></Sport>;
    },
    getTableView: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <Table title="Teams"
                   binding={binding}
                   onItemEdit={self._getEditFunction()}
                   getDataPromise={self.getDataPromise}
                   onItemRemove={self._getItemRemoveFunction}
            >
                <TableField dataField="sport"
                            filterType="none"
                            parseFunction={self._getSport}>Sport</TableField>
                <TableField dataField="name"
                            filterType="none">Team Name</TableField>
                <TableField dataField="description"
                            filterType="none">Description</TableField>
                <TableField dataField="gender"
                            filterType="none"
                            parseFunction={self._getGender}>Gender</TableField>
                <TableField dataField="ages"
                            filterType="none"
                            parseFunction={self._getAges}>Ages</TableField>
            </Table>
        );
    }
});

module.exports = TeamsListPage;