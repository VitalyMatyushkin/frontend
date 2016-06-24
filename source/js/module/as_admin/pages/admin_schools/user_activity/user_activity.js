const	React 			= require('react'),
		Table			= require('module/ui/list/table'),
		TableField		= require('module/ui/list/table_field'),
		ListPageMixin	= require('module/mixins/list_page_mixin');

const Logs = React.createClass({
	mixins: [Morearty.Mixin,ListPageMixin],
	serviceName:'useractivity',
	serviceCount:'useractivityCount',
	_getUserName: function(user) {
		let name = '';

		if(user) {
			name = user.firstName;
		}

		return name;
	},
	_getUserSurname: function(user) {
		let surname = '';

		if(user) {
			surname = user.lastName;
		}

		return surname;
	},
	_finishedAt: function(finishedAt) {
		const date = new Date(finishedAt);

		return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
								width="15%"
								parseFunction={self._getUserName}
								filterType="none"
					>
						Name
					</TableField>
					<TableField	dataField="user"
								width="13%"
								parseFunction={self._getUserSurname}
								filterType="none"
					>
						Surname
					</TableField>
					<TableField	dataField="httpVerb"
								width="17%"
					>
						Request Method
					</TableField>
					<TableField	dataField="httpUrl"
								width="20%"
					>
						Request Url
					</TableField>
					<TableField	dataField="httpStatusCode"
								width="15%"
					>
						Request Status
					</TableField>
					<TableField	dataField="finishedAt"
								width="20"
								filterType="none"
								parseFunction={self._finishedAt}
					>
						Finished At
					</TableField>
				</Table>
			</div>
		)
	}
});

module.exports = Logs;