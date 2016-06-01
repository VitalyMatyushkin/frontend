const 	Table         = require('module/ui/list/table'),
        TableField    = require('module/ui/list/table_field'),
        ListPageMixin = require('module/mixins/list_page_mixin'),
        React         = require('react'),
        Immutable 	  = require('immutable');

const SportsList = React.createClass({
    mixins: [Morearty.Mixin, ListPageMixin],
    serviceName: 'sports',
    _getDataPromise: function(filter){
        return window.Server.sports.get({filter: filter});
    },
    _getItemRemoveFunction: function(model) {
        const   self = this,
                binding = self.getDefaultBinding(),
                confirm = window.confirm("Do you really want to remove this sport?");

        if(confirm === true){
            window.Server.sport.delete({sportId: model.id}).then(function() {
                let dataFilteredData = binding.get('data').filter(function(sport) {
                    return sport.get('id') !== model.id;
                });

                binding.set('data', Immutable.fromJS(dataFilteredData));
            });
        }
    },
    getTableView: function() {
        const self      = this,
              binding   = self.getDefaultBinding();

        return (
            <Table title="Sports" binding={binding}
                   getDataPromise={self._getDataPromise}
                   onItemEdit={self._getEditFunction()}
                   onItemRemove={self._getItemRemoveFunction} >
                <TableField width="30%" dataField="name">Name</TableField>
                <TableField width="60%" dataField="description" >Description</TableField>
            </Table>
        )
    }
});

module.exports = SportsList;
