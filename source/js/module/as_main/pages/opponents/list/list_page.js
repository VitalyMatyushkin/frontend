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
			<Table title="Opponents list" binding={binding} onFilterChange={self.updateData}>
				<TableField width="30%" dataField="firstName">School name</TableField>
				<TableField width="25%" dataField="firstName">Adress</TableField>
				<TableField width="20%" dataField="firstName">Phone</TableField>
			</Table>
		)
	}
});


module.exports = OpponentsListPage;
