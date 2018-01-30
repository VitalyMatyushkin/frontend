import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';
import {TYPE_USER} from './register_user_type';

export const SchoolStep = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getSchoolService: function() {
		return (schoolName) => {
			const filter = {
				filter: {
					where: {
						name: {
							like: schoolName,
							options: 'i'
						},
						allowedPermissionPresets: {},
						/* this param was added later, so it is undefined on some schools. Default value is true.
						 * undefined considered as 'true'. So, just checking if it is not explicitly set to false
						 */
						availableForRegistration: { $ne: false }
					},
					limit: 1000,
					order: 'name ASC'
				}
			};
			switch (this.props.mode) {
				case TYPE_USER.STUDENT:
					filter.filter.where.allowedPermissionPresets = {STUDENT: { $ne: false }};
					break;
				case TYPE_USER.PARENT:
					filter.filter.where.allowedPermissionPresets = {PARENT: { $ne: false }};
					break;
			}
			return (window as any).Server.publicSchools.get(filter);
		};
	},

	handleSelectSchool: function(schoolId: string, schoolData: School): void {
		this.selectedSchool = schoolData;
	},

	onSubmit: function (data): void {
		this.props.handleChangeSchool(data, this.selectedSchool);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				binding         = {binding}
				onSubmit        = {this.onSubmit}
				onCancel        = {this.props.handleClickBack}
				rejectButtonText= 'Back'
			>
				<FormField
					type			= "autocomplete"
					field			= "schoolId"
					serviceFullData	= { this.getSchoolService() }
					onSelect		= { this.handleSelectSchool }
					defaultItem		= { this.props.defaultSchool }
					validation 	    = "required"
				>
					School
				</FormField>
			</Form>
		);
	}
});