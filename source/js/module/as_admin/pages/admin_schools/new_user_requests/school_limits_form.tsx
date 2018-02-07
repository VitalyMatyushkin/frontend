import * as React from "react"
import * as Immutable from 'immutable'
import * as Morearty from 'morearty'

import * as Form from 'module/ui/form/form'
import * as FormField from 'module/ui/form/form_field'

import {RolesHelper} from 'module/as_admin/pages/schools/roles_helper'
import * as MultiselectDropdown from 'module/ui/multiselect-dropdown/multiselect_dropdown'

export const SchoolLimitsForm = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSubmit: (React as any).PropTypes.func,
		isSolePETeacher: (React as any).PropTypes.bool
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		let serverRoles;
		if (this.props.isSolePETeacher) {
			serverRoles = RolesHelper.getAvailableRolesForSchoolBySolePETeacher();
			binding.sub('form').set('isClubsEnabled', false);
			binding.sub('form').set('canPublishWebSite', false);
			binding.sub('form').set('canAcceptStaffRoles', false);
			binding.sub('form').set('isFavoriteSportsEnabled', false);
		} else {
			serverRoles = RolesHelper.getAvailableRolesForSchoolByAdmin();
			binding.sub('form').set('isClubsEnabled', true);
			binding.sub('form').set('canPublishWebSite', true);
			binding.sub('form').set('canAcceptStaffRoles', true);
			binding.sub('form').set('isFavoriteSportsEnabled', true);
		}
		let availableRoles = RolesHelper.convertRolesFromServerToClient(serverRoles);
		if(typeof availableRoles === 'undefined') {
			availableRoles = [];
		}

		binding.set('availableRoles', Immutable.fromJS(availableRoles));
	},
	valueReader(value) {
		switch (value) {
			case true:	return false;
			case false:	return true;
		}
	},
	valueWriter(value) {
		switch (value) {
			case false: return true;
			case true:	return false;
		}
	},
	getSelectedRoles: function () {
		return this.getDefaultBinding().toJS('availableRoles');
	},
	handleSelectRole: function (role) {
		const binding = this.getDefaultBinding();
		const roles = binding.toJS('availableRoles');
		const roleIndex = roles.findIndex(_r => _r.id === role.id);

		if(roleIndex !== -1) {
			roles.splice(roleIndex, 1);
		} else {
			roles.push(role);
		}

		binding.set('availableRoles', Immutable.fromJS(roles));
	},
	render: function () {
		return (
			<Form
				name 			= { 'School Limits' }
				binding 		= { this.getDefaultBinding().sub('form') }
				onSubmit 		= { this.props.onSubmit }
				submitOnEnter 	= { false }
				hideCancelButton= { true }
				defaultButton   = { 'Save' }
			>
				<FormField
					valueReader = { this.valueReader }
					valueWriter = { this.valueWriter }
					classNames 	= "mWideSingleLine"
					type 		= "checkbox"
					field 		= "isClubsEnabled"
				>
					Disable clubs
				</FormField>
				<FormField
					valueReader = { this.valueReader }
					valueWriter = { this.valueWriter }
					classNames 	= "mWideSingleLine"
					type 		= "checkbox"
					field 		= "canPublishWebSite"
				>
					Disable publish web site
				</FormField>
				<FormField
					valueReader = { this.valueReader }
					valueWriter = { this.valueWriter }
					classNames 	= "mWideSingleLine"
					type 		= "checkbox"
					field 		= "canAcceptStaffRoles"
				>
					Disable accept staff roles
				</FormField>
				<FormField
					valueReader = { this.valueReader }
					valueWriter = { this.valueWriter }
					classNames 	= "mWideSingleLine"
					type 		= "checkbox"
					field 		= "isFavoriteSportsEnabled"
				>
					Disable favorite sports in limited school version
				</FormField>
				<div className="eForm_field">
					<div className="eForm_fieldName">
						Available roles
					</div>
					<MultiselectDropdown
						items			= { RolesHelper.getRoles() }
						selectedItems	= { this.getSelectedRoles() }
						handleClickItem	= { role => this.handleSelectRole(role) }
						extraStyle		= 'mSmallWide'
					/>
				</div>
			</Form>
		);
	}
});