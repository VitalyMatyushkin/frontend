const   Table 			= require('module/ui/list/table'),
        TableField 		= require('module/ui/list/table_field'),
        ListPageMixin 	= require('module/as_manager/pages/school_admin/list_page_mixin'),
        React 			= require('react');

const HousesListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'houses',
    onHouseEdit:function(data){
        const   self 			= this,
            globalBinding 	= self.getMoreartyContext().getBinding(),
            schoolId        = globalBinding.get('routing.pathParameters.0');

        document.location.hash = `school_sandbox/${schoolId}/houses/edit/${data.id}`;
    },
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Houses" binding={binding}  onItemEdit={self.onHouseEdit}
				   getDataPromise={self.getDataPromise} filter={self.filter}>
				<TableField dataField="name" filterType="none" width="180px">House name</TableField>
				<TableField dataField="description" filterType="none">Description</TableField>
				<TableField dataField="colors" filterType="colors">Color</TableField>
			</Table>
		);
	}
});


module.exports = HousesListPage;
