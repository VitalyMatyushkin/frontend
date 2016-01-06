var PermissionsListPage,
	List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	DateTimeMixin = require('module/mixins/datetime'),
	React = require('react'),
	ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin');

PermissionsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	serviceName: 'schoolPermissions',
	filters: {include: ['principal', {student: ['form', 'house']}, 'school']},
	getPrincipal: function(principal) {
		return [principal.firstName, principal.lastName].join(' ') + '\r\n[' + principal.email + ']';
	},
	getDate: function(meta) {
		var self = this;

		return self.getDateFromIso(meta.created);
	},
	getStatus: function(accepted) {
		var self = this,
			status = 'accepted';

		if (accepted === false) {
			status = 'declined';
		} else if (accepted === undefined) {
			status = 'waiting';
		}

		return status;
	},
	_getRemoveFunction: function(data) {
		var self = this,
			binding = self.getDefaultBinding();

		window.Server.schoolModelPermission.delete({id: data.schoolId, permissionId: data.id}).then(function() {
			binding.update(function(permissions) {
				return permissions.filter(function(permission) {
					return permission.get('id') !== data.id;
				});
			});
		});
	},
	getObject: function(permissionId) {
		var self = this,
			binding = self.getDefaultBinding(),
			permission = binding.get().find(function(model) {
				return permissionId === model.get('id');
			}),
			field,
			obj;

		if (permission.get('preset') === 'parent') {
			obj = permission.get('student');
			field = [
					obj.get('firstName'),
					obj.get('lastName')
				].join(' ') + '\r\n[' + [
					permission.get('student').get('form').get('name'),
					permission.get('student').get('house').get('name')
				].join(';') + ']';
		} else {
			obj = permission.get('school');
			field = [obj.get('name')].join(' ');
		}

		return field;
	},
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Permissions" binding={binding} onItemRemove={self._getRemoveFunction}
				   onFilterChange={self.updateData}>
				<TableField dataField="preset" width="20%">Preset</TableField>
				<TableField dataField="meta" width="15%" filterType="none" parseFunction={self.getDate}>Date</TableField>
				<TableField dataField="principal" parseFunction={self.getPrincipal} width="35%">Principal</TableField>
				<TableField dataField="id" parseFunction={self.getObject} width="25%">Object</TableField>
				<TableField dataField="accepted" width="20%" parseFunction={self.getStatus}>Status</TableField>
			</Table>
		)
	}
});


module.exports = PermissionsListPage;
