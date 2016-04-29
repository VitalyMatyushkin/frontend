const   Table			= require('module/ui/list/table'),
        TableField 		= require('module/ui/list/table_field'),
        DateTimeMixin 	= require('module/mixins/datetime'),
        ListPageMixin 	= require('module/mixins/list_page_mixin'),
        React 			= require('react');

const NewsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	setPageTitle: 'News',
	serviceName: 'schoolNews',
	serviceCount:'schoolNewsCount',
	_getImageThumbnail:function(url){
		if(url !== undefined){
			return (
				<span className="eChallenge_rivalPic">
                    <img src={window.Server.images.getResizedToBoxUrl(url, 60, 60)}/>
                </span>
			)
		}
	},
	getTableView: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<Table title="News" binding={binding} onItemEdit={self._getEditFunction()}
                   isPaginated={true} filter={self.filter} getDataPromise={self.getDataPromise}
                   getTotalCountPromise={self.getTotalCountPromise}>
				<TableField dataField="picUrl" filterType="none" parseFunction={self._getImageThumbnail}>Thumbnail</TableField>
				<TableField dataField="title" width="30%">Title</TableField>
                <TableField dataField="date" filterType="sorting" parseFunction={self.getDateFromIso}>Date</TableField>
			</Table>
		)
	}
});


module.exports = NewsListPage;
