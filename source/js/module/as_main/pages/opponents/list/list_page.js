var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	DateTimeMixin = require('module/mixins/datetime'),
	ListPageMixin = require('module/as_main/pages/opponents/list/list_page_mixin'),
	OpponentsListPage;

OpponentsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();
		//schoolOpponents
		return (
			<Table hideActions={true} binding={binding} onFilterChange={self.updateData}>
				<TableField filterType="none" width="20%" dataField="name">School name</TableField>
				<TableField filterType="none" width="55%" dataField="address">Adress</TableField>
				<TableField filterType="none" width="20%" dataField="phone">Phone</TableField>
			</Table>
		)
	}
});


module.exports = OpponentsListPage;
