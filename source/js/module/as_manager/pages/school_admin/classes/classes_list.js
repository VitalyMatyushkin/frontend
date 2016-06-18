
const 	Table = require('module/ui/list/table'),
		TableField = require('module/ui/list/table_field'),
		ListPageMixin = require('module/mixins/list_page_mixin'),
		React = require('react');

const ClassListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	setPageTitle: 'Forms',
	serviceName: 'schoolForms',
	filters:{limit:100},
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Classes" binding={binding} onItemEdit={self._getEditFunction()}
                   getDataPromise={self.getDataPromise}>
				<TableField width="40%" dataField="name" >Name</TableField>
				<TableField width="40%" dataField="age" filterType="none"
                            inputParseFunction={function(value) {return value.replace(/y/gi, '');}}
                            parseFunction={function(value) {return 'Y' + value;}}>Age group</TableField>
			</Table>
		)
	}
});


module.exports = ClassListPage;
