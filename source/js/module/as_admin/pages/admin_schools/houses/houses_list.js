const   Table = require('module/ui/list/table'),
        TableField = require('module/ui/list/table_field'),
        ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
        React = require('react');

const HousesListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'houses',
    sandbox:true,
    _getDataPromise:function(){
        return window.Server.getAllHouses.get({filter:{include:{relation:'school'}}});
    },
	_getSchoolDetails:function(school){
		if(school !== undefined){
			return school[0].name;
		}
	},
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Houses" binding={binding} onItemEdit={self._getEditFunction()}
				   getDataPromise={self._getDataPromise}>
				<TableField width="20%" dataField="school" filterType="none" parseFunction={self._getSchoolDetails}>School</TableField>
				<TableField dataField="name" filterType="none" width="180px">House name</TableField>
				<TableField dataField="description" filterType="none">Description</TableField>
				<TableField dataField="colors" filterType="colors">Color</TableField>
			</Table>
		);
	}
});


module.exports = HousesListPage;
