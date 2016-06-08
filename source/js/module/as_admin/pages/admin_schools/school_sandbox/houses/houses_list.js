const   Table 			= require('module/ui/list/table'),
        TableField 		= require('module/ui/list/table_field'),
        ListPageMixin 	= require('module/mixins/list_page_mixin'),
        React 			= require('react');

const HousesListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'schoolHouses',
    onHouseEdit:function(data){
        const   self 			= this,
                globalBinding 	= self.getMoreartyContext().getBinding(),
                schoolId        = globalBinding.get('routing.pathParameters.0');

        document.location.hash = `school_sandbox/${schoolId}/houses/edit/${data.id}`;
    },
    _getDataPromise:function(filter){
        const   self 			= this,
                globalBinding 	= self.getMoreartyContext().getBinding(),
                schoolId        = globalBinding.get('routing.pathParameters.0');

        return window.Server[self.serviceName].get(schoolId, { filter: filter });
    },
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Houses" binding={binding}  onItemEdit={self.onHouseEdit}
				   getDataPromise={self._getDataPromise} filter={self.filter}>
				<TableField dataField="name" width="180px">House name</TableField>
				<TableField dataField="description" >Description</TableField>
				<TableField dataField="colors" type="colors"  filterType="none">Color</TableField>
			</Table>
		);
	}
});


module.exports = HousesListPage;
