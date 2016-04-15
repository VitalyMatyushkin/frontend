
const 	Table 			= require('module/ui/list/table'),
		TableField 		= require('module/ui/list/table_field'),
		ListPageMixin 	= require('module/as_manager/pages/school_admin/list_page_mixin'),
		React 			= require('react');

const ClassListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'forms',
    setPageTitle: 'forms',
    filters:{include:{relation:'school'}},
	componentWillMount:function() {
		//const self 			= this,
		//	globalBinding 	= self.getMoreartyContext().getBinding();
	},
    onClassEdit:function(data){
        const   self 			= this,
        	    globalBinding 	= self.getMoreartyContext().getBinding(),
                schoolId        = globalBinding.get('routing.pathParameters.0');

        document.location.hash = `school_sandbox/${schoolId}/forms/edit/${data.id}`;
    },
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<Table title="Classes" binding={binding} onItemEdit={self.onClassEdit}
                   getDataPromise={self.getDataPromise} filter={self.filter}>
				<TableField width="40%" dataField="name" >Name</TableField>
				<TableField width="40%" dataField="age" filterType="none"
                            inputParseFunction={function(value) {return value.replace(/y/gi, '');}}
                            parseFunction={function(value) {return 'Y' + value;}}>Age group</TableField>
			</Table>
		)
	}
});


module.exports = ClassListPage;
