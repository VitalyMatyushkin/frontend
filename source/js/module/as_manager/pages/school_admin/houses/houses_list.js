const Table         = require('module/ui/list/table'),
      TableField    = require('module/ui/list/table_field'),
      ListPageMixin = require('module/mixins/list_page_mixin'),
      React         = require('react');

const HousesListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'schoolHouses',
	_getItemRemoveFunction:function(data){
		var self = this,
			binding = self.getDefaultBinding();
		if(data !== undefined){
			window.Server.schoolHouse.delete({houseId:data.id}).then(function(res){
				binding.update('data',function(houses){
					return houses.filter(function(house){
						return house.get('id') !== data.id;
					});
				});
				return res;
			});
		}
	},
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Houses" binding={binding} onItemEdit={self._getEditFunction()}
				   getDataPromise={self.getDataPromise} onItemRemove={self._getItemRemoveFunction}>
				<TableField dataField="name" filterType="none" width="180px">House name</TableField>
				<TableField dataField="description" filterType="none">Description</TableField>
				<TableField dataField="colors" filterType="colors">Color</TableField>
			</Table>
		);
	}
});

module.exports = HousesListPage;
