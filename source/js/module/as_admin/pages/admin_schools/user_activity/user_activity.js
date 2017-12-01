const	React 			= require('react'),
		Table			= require('module/ui/list/table'),
		TableField		= require('module/ui/list/table_field'),
		ListPageMixin	= require('module/mixins/list_page_mixin'),
		{DateHelper}	= require('../../../../helpers/date_helper'),
		Morearty		= require('morearty'),
		{Avatar} 		= require('module/ui/avatar/avatar');

const Logs = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName:'useractivity',
	serviceCount:'useractivityCount',
	filters:{'order' : 'startedAt DESC'},
	_getUserAvatar: function(user) {
		let avatar = '';

		if(user){
			avatar = (
				<div className="eUserAvatar">
					<Avatar pic={user.avatar} minValue={50}/>
				</div>
			)
		}

		return avatar;
	},
	_getUserName: function(user) {
		let name = '';

		if(user) {
			name = user.firstName + ' ' + user.lastName;
		}

		return name;
	},
	_getUrl: function(url) {
		return (
			<div className="eUrl" title={url}>
				{url}
			</div>
		);
	},
	_finishedAt: function(finishedAt) {
		const date = new Date(finishedAt);

		return `${DateHelper.getDateStringFromDateObject(date)} ${DateHelper.getTimeStringFromDateObject(date)}`;
	},
	getTableView: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div className="eTable_view">
				<Table	title="User Activity"
						binding={binding}
						isPaginated={true}
						hideActions={true}
						getDataPromise={self.getDataPromise}
						getTotalCountPromise={self.getTotalCountPromise}
				>
					<TableField	dataField="user"
								filterType="none"
								parseFunction={self._getUserAvatar}
					>
					</TableField>
					<TableField	dataField="user"
								parseFunction={self._getUserName}
								filterType="none"
					>
						Name
					</TableField>
					<TableField	dataField="userEmail">
						Email
					</TableField>
					<TableField	dataField="httpVerb">
						Method
					</TableField>
					<TableField	dataField="httpUrl" parseFunction={self._getUrl}>
						Url
					</TableField>
					<TableField	dataField="httpStatusCode">
						Status
					</TableField>
					<TableField	dataField="finishedAt"
								filterType="sorting"
								parseFunction={self._finishedAt}
					>
						Finished
					</TableField>
				</Table>
			</div>
		)
	}
});

module.exports = Logs;