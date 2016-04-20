
const 	Table = require('module/ui/list/table'),
		TableField = require('module/ui/list/table_field'),
		ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
		React = require('react');

const ClassListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'schoolForms',
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
