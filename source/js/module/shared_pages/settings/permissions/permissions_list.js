var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	DateTimeMixin = require('module/mixins/datetime'),
	SVG = require('module/ui/svg'),
	PermissionsList;


PermissionsList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			userId = globalBinding.toJS('userData.authorizationInfo.userId');

		self.request && self.request.cancel();

		self.request = window.Server.userPermission.get(userId).then(function (data) {
			binding.set(Immutable.fromJS(data));
		});
	},
	componentWillUnmount: function () {
		var self = this;

		self.request && self.request.cancel();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<h1 className="eSchoolMaster_title">My permissions
					<div className="eSchoolMaster_buttons"><a href="#settings/permissions/add" className="bButton">Add...</a></div>
				</h1>

				<Table title="Students" binding={binding}>
					<TableField width="15%" filterType="none"  dataField="schoolId">School id</TableField>
					<TableField width="15%" filterType="none"  dataField="studentId">Student id</TableField>
					<TableField width="5%" filterType="none"  dataField="comment">Comment</TableField>
					<TableField width="20%" filterType="none"  dataField="accepted">Accepted?</TableField>
				</Table>
			</div>
		)
	}
});


module.exports = PermissionsList;

