var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	DateTimeMixin = require('module/mixins/datetime'),
	ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
	NewsListPage;

NewsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	serviceName: 'news',
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="News" binding={binding} onItemEdit={self._getEditFunction()} onFilterChange={self.updateData}>
				<TableField dataField="title" width="30%">Title</TableField>
				<TableField dataField="body" width="45%">Text</TableField>
				<TableField dataField="date" width="190px" filterType="none" parseFunction={self.getDateFromIso}>Date</TableField>
			</Table>
		)
	}
});


module.exports = NewsListPage;
