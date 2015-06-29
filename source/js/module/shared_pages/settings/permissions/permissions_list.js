var PermissionsList;

PermissionsList = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<h1 className="eSchoolMaster_title">My permissions
					<div className="eSchoolMaster_buttons"><a href="#settings/permissions/add" className="bButton">Add...</a></div>
				</h1>

				List
			</div>
		)
	}
});


module.exports = PermissionsList;

