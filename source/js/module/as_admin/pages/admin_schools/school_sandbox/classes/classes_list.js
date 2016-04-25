
const 	Table 			= require('module/ui/list/table'),
		TableField 		= require('module/ui/list/table_field'),
		ListPageMixin 	= require('module/mixins/list_page_mixin'),
		React 			= require('react');

const ClassListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'schoolForms',
    setPageTitle: 'forms',
    filters:{include:{relation:'school'}},
    onClassEdit:function(data){
        const   self 			= this,
        	    globalBinding 	= self.getMoreartyContext().getBinding(),
                schoolId        = globalBinding.get('routing.pathParameters.0');

        document.location.hash = `school_sandbox/${schoolId}/forms/edit/${data.id}`;
    },
    _getDataPromise:function(filter){
        const   self 			= this,
                globalBinding 	= self.getMoreartyContext().getBinding(),
                schoolId        = globalBinding.get('routing.pathParameters.0');

        return window.Server[self.serviceName].get(schoolId, { filter: filter });
    },
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<Table title="Classes" binding={binding} onItemEdit={self.onClassEdit}
                   getDataPromise={self._getDataPromise} filter={self.filter}>
				<TableField width="40%" dataField="name" >Name</TableField>
				<TableField width="40%" dataField="age" filterType="none"
                            inputParseFunction={function(value) {return value.replace(/y/gi, '');}}
                            parseFunction={function(value) {return 'Y' + value;}}>Age group</TableField>
			</Table>
		)
	}
});


module.exports = ClassListPage;
