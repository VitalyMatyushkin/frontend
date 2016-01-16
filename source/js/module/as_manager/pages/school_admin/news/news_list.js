const   Table = require('module/ui/list/table'),
        TableField = require('module/ui/list/table_field'),
        DateTimeMixin = require('module/mixins/datetime'),
        ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
        React = require('react');

const NewsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	serviceName: 'news',
	serviceCount:'newsCount',
	getTableView: function() {
		const self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="News" binding={binding} onItemEdit={self._getEditFunction()}
                   isPaginated={true} filter={self.filter} getDataPromise={self.getDataPromise}
                   getTotalCountPromise={self.getTotalCountPromise}>
				<TableField dataField="title" width="30%">Title</TableField>
				<TableField dataField="body" width="45%" filterType="none">Text</TableField>
				<TableField dataField="date" width="190px" filterType="none" parseFunction={self.getDateFromIso}>Date</TableField>
			</Table>
		)
	}
});


module.exports = NewsListPage;
