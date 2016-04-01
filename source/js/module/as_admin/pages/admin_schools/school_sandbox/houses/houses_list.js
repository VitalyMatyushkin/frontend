const   Table 			= require('module/ui/list/table'),
        TableField 		= require('module/ui/list/table_field'),
        ListPageMixin 	= require('module/as_manager/pages/school_admin/list_page_mixin'),
        React 			= require('react');

const HousesListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'houses',
    sandbox:true,
    _getDataPromise:function(){
		const 	self			= this,
				globalBinding	= self.getMoreartyContext().getBinding();
        return window.Server.getAllHouses.get({filter:{where:{schoolId:globalBinding.get('userRules.activeSchoolId')}}});
    },
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Houses" binding={binding} onItemEdit={self._getEditFunction()}
				   getDataPromise={self._getDataPromise} filter={self.filter}>
				<TableField dataField="name" filterType="none" width="180px">House name</TableField>
				<TableField dataField="description" filterType="none">Description</TableField>
				<TableField dataField="colors" filterType="colors">Color</TableField>
			</Table>
		);
	}
});


module.exports = HousesListPage;
